import chai from 'chai';
let expect = chai.expect;

import sinon from 'sinon';
import sinonChai from 'sinon-chai'

chai.use(sinonChai);

import React from 'react'
import TestUtils from 'react-addons-test-utils'
import TodoTextInput from '../../src/components/TodoTextInput'

function setup(propOverrides) {
  const props = Object.assign({
    onSave: sinon.spy(),
    text: 'Use Redux',
    placeholder: 'What needs to be done?',
    editing: false,
    newTodo: false
  }, propOverrides)

  const renderer = TestUtils.createRenderer()

  renderer.render(
    <TodoTextInput {...props} />
  )

  let output = renderer.getRenderOutput()

  output = renderer.getRenderOutput()

  return {
    props: props,
    output: output,
    renderer: renderer
  }
}

describe('components', () => {
  describe('TodoTextInput', () => {
    it('should render correctly', () => {
      const { output } = setup()
      expect(output.props.placeholder).to.equal('What needs to be done?')
      expect(output.props.value).to.equal('Use Redux')
      expect(output.props.className).to.equal('')
    })

    it('should render correctly when editing=true', () => {
      const { output } = setup({ editing: true })
      expect(output.props.className).to.equal('edit')
    })

    it('should render correctly when newTodo=true', () => {
      const { output } = setup({ newTodo: true })
      expect(output.props.className).to.equal('new-todo')
    })

    it('should update value on change', () => {
      const { output, renderer } = setup()
      output.props.onChange({ target: { value: 'Use Radox' } })
      const updated = renderer.getRenderOutput()
      expect(updated.props.value).to.equal('Use Radox')
    })

    it('should call onSave on return key press', () => {
      const { output, props } = setup()
      output.props.onKeyDown({ which: 13, target: { value: 'Use Redux' } })
      expect(props.onSave).to.have.been.calledWith('Use Redux')
    })

    it('should reset state on return key press if newTodo', () => {
      const { output, renderer } = setup({ newTodo: true })
      output.props.onKeyDown({ which: 13, target: { value: 'Use Redux' } })
      const updated = renderer.getRenderOutput()
      expect(updated.props.value).to.equal('')
    })

    it('should call onSave on blur', () => {
      const { output, props } = setup()
      output.props.onBlur({ target: { value: 'Use Redux' } })
      expect(props.onSave).to.have.been.calledWith('Use Redux')
    })

    it('shouldnt call onSave on blur if newTodo', () => {
      const { output, props } = setup({ newTodo: true })
      output.props.onBlur({ target: { value: 'Use Redux' } })
      expect(props.onSave.callCount).to.equal(0)
    })
  })
})
