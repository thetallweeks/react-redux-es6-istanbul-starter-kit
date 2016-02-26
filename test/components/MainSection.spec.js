import chai from 'chai';
let expect = chai.expect;

import sinon from 'sinon';
import sinonChai from 'sinon-chai'

chai.use(sinonChai);

import React from 'react'
import TestUtils from 'react-addons-test-utils'
import MainSection from '../../src/components/MainSection'
import TodoItem from '../../src/components/TodoItem'
import Footer from '../../src/components/Footer'
import { SHOW_ALL, SHOW_COMPLETED } from '../../src/constants/TodoFilters'

function setup(propOverrides) {
  const props = Object.assign({
    todos: [
      {
        text: 'Use Redux',
        completed: false,
        id: 0
      }, {
        text: 'Run the tests',
        completed: true,
        id: 1
      }
    ],
    actions: {
      editTodo: sinon.spy(),
      deleteTodo: sinon.spy(),
      completeTodo: sinon.spy(),
      completeAll: sinon.spy(),
      clearCompleted: sinon.spy()
    }
  }, propOverrides)

  const renderer = TestUtils.createRenderer()
  renderer.render(<MainSection {...props} />)
  const output = renderer.getRenderOutput()

  return {
    props: props,
    output: output,
    renderer: renderer
  }
}

describe('components', () => {
  describe('MainSection', () => {
    it('should render container', () => {
      const { output } = setup()
      expect(output.type).to.equal('section')
      expect(output.props.className).to.equal('main')
    })

    describe('toggle all input', () => {
      it('should render', () => {
        const { output } = setup()
        const [ toggle ] = output.props.children
        expect(toggle.type).to.equal('input')
        expect(toggle.props.type).to.equal('checkbox')
        expect(toggle.props.checked).to.equal(false)
      })

      it('should be checked if all todos completed', () => {
        const { output } = setup({ todos: [
          {
            text: 'Use Redux',
            completed: true,
            id: 0
          }
        ]
        })
        const [ toggle ] = output.props.children
        expect(toggle.props.checked).to.equal(true)
      })

      it('should call completeAll on change', () => {
        const { output, props } = setup()
        const [ toggle ] = output.props.children
        toggle.props.onChange({})
        expect(props.actions.completeAll).to.have.been.called
      })
    })

    describe('footer', () => {
      it('should render', () => {
        const { output } = setup()
        const [ , , footer ] = output.props.children
        expect(footer.type).to.equal(Footer)
        expect(footer.props.completedCount).to.equal(1)
        expect(footer.props.activeCount).to.equal(1)
        expect(footer.props.filter).to.equal(SHOW_ALL)
      })

      it('onShow should set the filter', () => {
        const { output, renderer } = setup()
        const [ , , footer ] = output.props.children
        footer.props.onShow(SHOW_COMPLETED)
        const updated = renderer.getRenderOutput()
        const [ , , updatedFooter ] = updated.props.children
        expect(updatedFooter.props.filter).to.equal(SHOW_COMPLETED)
      })

      it('onClearCompleted should call clearCompleted', () => {
        const { output, props } = setup()
        const [ , , footer ] = output.props.children
        footer.props.onClearCompleted()
        expect(props.actions.clearCompleted).to.have.been.called
      })
    })

    describe('todo list', () => {
      it('should render', () => {
        const { output, props } = setup()
        const [ , list ] = output.props.children
        expect(list.type).to.equal('ul')
        expect(list.props.children.length).to.equal(2)
        list.props.children.forEach((item, i) => {
          expect(item.type).to.equal(TodoItem)
          expect(item.props.todo).to.equal(props.todos[i])
        })
      })

      it('should filter items', () => {
        const { output, renderer, props } = setup()
        const [ , , footer ] = output.props.children
        footer.props.onShow(SHOW_COMPLETED)
        const updated = renderer.getRenderOutput()
        const [ , updatedList ] = updated.props.children
        expect(updatedList.props.children.length).to.equal(1)
        expect(updatedList.props.children[0].props.todo).to.equal(props.todos[1])
      })
    })
  })
})
