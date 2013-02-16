describe "Ajax", ->

  before ->
    $(document).on 'ajaxError', (e, xhr) ->
      throw "server returned #{xhr.status}"

  after ->
    $(document).off()

  describe "$.get", ->

    it "fetches", (done) ->
      xhr = $.get "/test/echo", (data) ->
        expect(data).include "GET ?{}"
        done()
      expect(xhr).property 'abort'

    it "serializes data as query params", (done) ->
      $.get "/test/echo", { sample: "data" }, (data) ->
        expect(data).include 'GET ?{"sample":"data"}'
        done()

    it "supports dataType argument", (done) ->
      $.get "/test/echo", (data) ->
        expect(data).include 'accept: text/plain'
        done()
      , 'text'

    it "supports query params & dataType argument", (done) ->
      $.get "/test/echo", { sample: "data" }, (data) ->
        expect(data).include 'GET ?{"sample":"data"}'
        expect(data).include 'accept: text/plain'
        done()
      , 'text'
