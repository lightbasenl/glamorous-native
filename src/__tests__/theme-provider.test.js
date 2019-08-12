import React from 'react'
import {View} from 'react-native'
import {shallow} from 'enzyme'
import ThemeProvider from '../theme-provider'
import glamorous from '../'

// this test left to validate changes don't break contract
test('renders a component with theme', () => {
  const Comp = glamorous.view(
    {
      backgroundColor: 'red',
    },
    (props, theme) => ({padding: theme.padding}),
  )

  const wrapper = shallow(
    <ThemeProvider theme={{padding: 10}}>
      <Comp />
    </ThemeProvider>,
  )

  wrapper.instance().UNSAFE_componentWillMount()

  const compWrapper = wrapper
    .find(Comp)
    .shallow({context: wrapper.instance().getChildContext()})

  compWrapper.instance().UNSAFE_componentWillMount()

  expect(compWrapper.props()).toMatchObject({
    style: [{backgroundColor: 'red'}, {padding: 10}],
  })
})

test('renders a component with theme from props', () => {
  const Comp = glamorous.view(
    {
      backgroundColor: 'red',
    },
    props => ({padding: props.theme.padding}),
  )

  const wrapper = shallow(
    <ThemeProvider theme={{padding: 10}}>
      <Comp />
    </ThemeProvider>,
  )

  wrapper.instance().UNSAFE_componentWillMount()

  const compWrapper = wrapper
    .find(Comp)
    .shallow({context: wrapper.instance().getChildContext()})

  compWrapper.instance().UNSAFE_componentWillMount()

  expect(compWrapper.props()).toMatchObject({
    style: [{backgroundColor: 'red'}, {padding: 10}],
  })
})

test('theme properties updates get propagated down the tree', () => {
  class Parent extends React.Component {
    state = {
      padding: 10,
    }

    render() {
      return (
        <ThemeProvider theme={{padding: this.state.padding}}>
          <Child />
        </ThemeProvider>
      )
    }
  }

  const Child = glamorous.view(
    {
      backgroundColor: 'red',
    },
    props => ({padding: props.theme.padding}),
  )

  const wrapper = shallow(<Parent />)

  const themeWrapper = wrapper.find(ThemeProvider).shallow()

  themeWrapper.instance().UNSAFE_componentWillMount()

  const compWrapper = wrapper
    .find(Child)
    .shallow({context: themeWrapper.instance().getChildContext()})

  compWrapper.instance().UNSAFE_componentWillMount()

  expect(compWrapper.props()).toMatchObject({
    style: [{backgroundColor: 'red'}, {padding: 10}],
  })
})

test('merges nested themes', () => {
  const One = glamorous.view({}, ({theme: {padding, margin}}) => ({
    padding,
    margin,
  }))

  const Two = glamorous.view({}, ({theme: {padding, margin}}) => ({
    padding,
    margin,
  }))

  const wrapper = shallow(
    <ThemeProvider theme={{padding: 1, margin: 1}}>
      <View>
        <One />
        <ThemeProvider theme={{margin: 2}}>
          <Two />
        </ThemeProvider>
      </View>
    </ThemeProvider>,
  )

  wrapper.instance().UNSAFE_componentWillMount()
  const oneWrapper = wrapper
    .find(One)
    .shallow({context: wrapper.instance().getChildContext()})
  oneWrapper.instance().UNSAFE_componentWillMount()

  const innerThemeWrapper = wrapper
    .find(ThemeProvider)
    .shallow({context: wrapper.instance().getChildContext()})
  innerThemeWrapper.instance().UNSAFE_componentWillMount()

  const twoWrapper = innerThemeWrapper
    .find(Two)
    .shallow({context: innerThemeWrapper.instance().getChildContext()})
  twoWrapper.instance().UNSAFE_componentWillMount()

  expect(oneWrapper.props()).toMatchObject({
    style: [{padding: 1, margin: 1}],
  })

  expect(twoWrapper.props()).toMatchObject({
    style: [{padding: 1, margin: 2}],
  })
})
