import chai from 'chai';
let expect = chai.expect;

import sinon from 'sinon';
import sinonChai from 'sinon-chai'

chai.use(sinonChai);

import React from 'react'
import TestUtils from 'react-addons-test-utils'
import TodoItem from '../../src/components/TodoItem'
import TodoTextInput from '../../src/components/TodoTextInput'

function setup( editing = false ) {
  const props = {
    todo: {
      id: 0,
      text: 'Use Redux',
      completed: false
    },
    editTodo: sinon.spy(),
    deleteTodo: sinon.spy(),
    completeTodo: sinon.spy()
  }

  const renderer = TestUtils.createRenderer()

  renderer.render(
    <TodoItem {...props} />
  )

  let output = renderer.getRenderOutput()

  if (editing) {
    const label = output.props.children.props.children[1]
    label.props.onDoubleClick({})
    output = renderer.getRenderOutput()
  }

  return {
    props: props,
    output: output,
    renderer: renderer
  }
}

describe('components', () => {
  describe('TodoItem', () => {
    it('initial render', () => {
      const { output } = setup()

      expect(output.type).to.equal('li')
      expect(output.props.className).to.equal('')

      const div = output.props.children

      expect(div.type).to.equal('div')
      expect(div.props.className).to.equal('view')

      const [ input, label, button ] = div.props.children

      expect(input.type).to.equal('input')
      expect(input.props.checked).to.equal(false)

      expect(label.type).to.equal('label')
      expect(label.props.children).to.equal('Use Redux')

      expect(button.type).to.equal('button')
      expect(button.props.className).to.equal('destroy')
    })

    it('input onChange should call completeTodo', () => {
      const { output, props } = setup()
      const input = output.props.children.props.children[0]
      input.props.onChange({})
      expect(props.completeTodo).to.have.been.calledWith(0)
    })

    it('button onClick should call deleteTodo', () => {
      const { output, props } = setup()
      const button = output.props.children.props.children[2]
      button.props.onClick({})
      expect(props.deleteTodo).to.have.been.calledWith(0)
    })

    it('label onDoubleClick should put component in edit state', () => {
      const { output, renderer } = setup()
      const label = output.props.children.props.children[1]
      label.props.onDoubleClick({})
      const updated = renderer.getRenderOutput()
      expect(updated.type).to.equal('li')
      expect(updated.props.className).to.equal('editing')
    })

    it('edit state render', () => {
      const { output } = setup(true)

      expect(output.type).to.equal('li')
      expect(output.props.className).to.equal('editing')

      const input = output.props.children
      expect(input.type).to.equal(TodoTextInput)
      expect(input.props.text).to.equal('Use Redux')
      expect(input.props.editing).to.equal(true)
    })

    it('TodoTextInput onSave should call editTodo', () => {
      const { output, props } = setup(true)
      output.props.children.props.onSave('Use Redux')
      expect(props.editTodo).to.have.been.calledWith(0, 'Use Redux')
    })

    it('TodoTextInput onSave should call deleteTodo if text is empty', () => {
      const { output, props } = setup(true)
      output.props.children.props.onSave('')
      expect(props.deleteTodo).to.have.been.calledWith(0)
    })

    it('TodoTextInput onSave should exit component from edit state', () => {
      const { output, renderer } = setup(true)
      output.props.children.props.onSave('Use Redux')
      const updated = renderer.getRenderOutput()
      expect(updated.type).to.equal('li')
      expect(updated.props.className).to.equal('')
    })
  })
})
