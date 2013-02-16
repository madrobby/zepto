describe "Event", ->
  describe "$.proxy", ->
    it "binds to an object", ->
      obj = {}
      fn = -> [this, arguments]

      [ self, args ] = $.proxy(fn, obj)('one', 'two')
      expect(self).to.equal(obj)
      expect(args[0]).to.equal('one')
      expect(args[1]).to.equal('two')
