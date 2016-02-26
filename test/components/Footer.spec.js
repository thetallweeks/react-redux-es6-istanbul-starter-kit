import chai from 'chai';
let expect = chai.expect;

import sinon from 'sinon';
import sinonChai from 'sinon-chai'

chai.use(sinonChai);
import React from 'react'
import TestUtils from 'react-addons-test-utils'
import Footer from '../../src/components/Footer'
import { SHOW_ALL, SHOW_ACTIVE } from '../../src/constants/TodoFilters'

function setup(propOverrides) {
  const props = Object.assign({
    completedCount: 0,
    activeCount: 0,
    filter: SHOW_ALL,
    onClearCompleted: sinon.spy(),
    onShow: sinon.spy()
  }, propOverrides)

  const renderer = TestUtils.createRenderer()
  renderer.render(<Footer {...props} />)
  const output = renderer.getRenderOutput()

  return {
    props: props,
    output: output
  }
}

function getTextContent(elem) {
  const children = Array.isArray(elem.props.children) ?
    elem.props.children : [ elem.props.children ]

  return children.reduce(function concatText(out, child) {
    // Children are either elements or text strings
    return out + (child.props ? getTextContent(child) : child)
  }, '')
}

describe('components', () => {
  describe('Footer', () => {
    it('should render container', () => {
      const { output } = setup()
      expect(output.type).to.equal('footer')
      expect(output.props.className).to.equal('footer')
    })

    it('should display active count when 0', () => {
      const { output } = setup({ activeCount: 0 })
      const [ count ] = output.props.children
      expect(getTextContent(count)).to.equal('No items left')
    })

    it('should display active count when above 0', () => {
      const { output } = setup({ activeCount: 1 })
      const [ count ] = output.props.children
      expect(getTextContent(count)).to.equal('1 item left')
    })

    it('should render filters', () => {
      const { output } = setup()
      const [ , filters ] = output.props.children
      expect(filters.type).to.equal('ul')
      expect(filters.props.className).to.equal('filters')
      expect(filters.props.children.length).to.equal(3)
      filters.props.children.forEach(function checkFilter(filter, i) {
        expect(filter.type).to.equal('li')
        const a = filter.props.children
        expect(a.props.className).to.equal(i === 0 ? 'selected' : '')
        expect(a.props.children).to.equal({
          0: 'All',
          1: 'Active',
          2: 'Completed'
        }[i])
      })
    })

    it('should call onShow when a filter is clicked', () => {
      const { output, props } = setup()
      const [ , filters ] = output.props.children
      const filterLink = filters.props.children[1].props.children
      filterLink.props.onClick({})
      expect(props.onShow).to.have.been.calledWith(SHOW_ACTIVE)
    })

    it('shouldnt show clear button when no completed todos', () => {
      const { output } = setup({ completedCount: 0 })
      const [ , , clear ] = output.props.children
      expect(clear).to.equal(undefined)
    })

    it('should render clear button when completed todos', () => {
      const { output } = setup({ completedCount: 1 })
      const [ , , clear ] = output.props.children
      expect(clear.type).to.equal('button')
      expect(clear.props.children).to.equal('Clear completed')
    })

    it('should call onClearCompleted on clear button click', () => {
      const { output, props } = setup({ completedCount: 1 })
      const [ , , clear ] = output.props.children
      clear.props.onClick({})
      expect(props.onClearCompleted).to.have.been.called
    })
  })
})
