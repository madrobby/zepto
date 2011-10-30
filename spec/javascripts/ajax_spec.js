describe('Ajax', function () {

    var beforeSend, onSuccess, onComplete, onError, settings, request, xhrResponse;

    describe('$.ajax', function () {
        it('should be defined', function () {
            expect($.ajax).toBeDefined();
        });

        it('should returns xhr object', function () {
            expect($.ajax().onreadystatechange).toBeDefined();
        });

        describe('XHR request', function () {

            var performAjax = function () {
                $.ajax(settings);
                request = mostRecentAjaxRequest();
                request.response(xhrResponse);
            };

            beforeEach(function () {
                jasmine.Ajax.useMock();
                beforeSend = jasmine.createSpy('beforeSend');
                onSuccess = jasmine.createSpy('onSuccess');
                onError = jasmine.createSpy('onError');
                onComplete = jasmine.createSpy('onComplete');
            });

            describe('on GET request', function () {

                beforeEach(function () {
                    settings = {
                        url:        '/example/url',
                        success:    onSuccess,
                        error:      onError,
                        complete:   onComplete,
                        beforeSend: beforeSend
                    };

                    xhrResponse = {
                        status: 200,
                        responseText: 'Small is beautiful.'
                    };
                });

                describe('beforeSend callback', function () {

                    beforeEach(function () {
                        performAjax();
                    });

                    it('should call beforeSend callback', function () {
                        expect(beforeSend).toHaveBeenCalled();
                    });

                    it('should pass xhr and settings to beforeSend callback', function () {
                        var args = beforeSend.mostRecentCall.args;
                        expect(args.length).toEqual(2);
                        expect(args[0].constructor).toEqual(FakeXMLHttpRequest);
                        expect(args[1].constructor).toEqual(Object);
                        expect(args[1].beforeSend).toEqual(beforeSend);
                    });
                });

                describe('success callback', function () {

                    beforeEach(function () {
                        performAjax();
                    });

                    it('should call success callback', function () {
                        expect(onSuccess).toHaveBeenCalled();
                    });

                    it('should pass responseText, success string and xhr object to success callback', function () {
                        var args = onSuccess.mostRecentCall.args;
                        expect(args.length).toEqual(3);
                        expect(args[0]).toEqual('Small is beautiful.');
                        expect(args[1]).toEqual('success');
                        expect(args[2].constructor).toEqual(FakeXMLHttpRequest);
                    });
                });

                describe('error callback', function () {

                    beforeEach(function () {
                        xhrResponse.status = 500;
                        performAjax();
                    });

                    it('should call error callback', function () {
                        expect(onError).toHaveBeenCalled();
                    });

                    it('should pass xhr and error string to error callback', function () {
                        var args = onError.mostRecentCall.args;
                        expect(args.length).toEqual(3);
                        expect(args[0].constructor).toEqual(FakeXMLHttpRequest);
                        expect(args[1]).toEqual('error');
                        expect(args[2]).toBe(null);
                    });
                });

                describe('complete callback', function () {

                    it('should call error callback on 200', function () {
                        performAjax();
                        expect(onComplete).toHaveBeenCalled();
                    });

                    it('should call error callback on 200', function () {
                        xhrResponse.status = 500;
                        performAjax();
                        expect(onComplete).toHaveBeenCalled();
                    });

                    it('should pass xhr and success string to complete callback', function () {
                        performAjax();
                        var args = onComplete.mostRecentCall.args;
                        expect(args.length).toEqual(2);
                        expect(args[0].constructor).toEqual(FakeXMLHttpRequest);
                        expect(args[1]).toEqual('success');
                    });

                    it('should pass xhr and error string to complete callback', function () {
                        xhrResponse.status = 500;
                        performAjax();
                        var args = onComplete.mostRecentCall.args;
                        expect(args[1]).toEqual('error');
                    });
                });
            });
        });
    });

    describe('$.get', function () {
        it('should be defined', function () {
            expect($.get).toBeDefined();
        });

        it('should call $.ajax with url and success callback', function () {
            var successCallback = function () {};

            var zeptoAjax = $.ajax;
            $.ajax = jasmine.createSpy('$.ajax');

            $.get('/example/url', successCallback);

            var options = $.ajax.mostRecentCall.args[0];

            expect(options.constructor).toBe(Object);
            expect(options.url).toBe('/example/url');
            expect(options.success).toBe(successCallback);

            $.ajax = zeptoAjax;
        });
    });

    describe('$.post', function () {
        it('should be defined', function () {
            expect($.post).toBeDefined();
        });
    });

    describe('$.getJSON', function () {
        it('should be defined', function () {
            expect($.post).toBeDefined();
        });
    });

    describe('$.load', function () {
        it('should be defined', function () {
            expect($.post).toBeDefined();
        });
    });

    describe('$.param', function () {
        it('should be defined', function () {
            expect($.post).toBeDefined();
        });
    });

    describe('$.ajaxSettings', function () {
        it('should be defined', function () {
            expect($.ajaxSettings).toBeDefined();
        });

        it('should contain default ajax settings', function () {
            expect($.ajaxSettings.constructor).toBe(Object);
            expect($.ajaxSettings.type).toBe('GET');
            expect($.ajaxSettings.beforeSend.constructor).toBe(Function);
            expect($.ajaxSettings.success.constructor).toBe(Function);
            expect($.ajaxSettings.error.constructor).toBe(Function);
            expect($.ajaxSettings.complete.constructor).toBe(Function);
            expect($.ajaxSettings.xhr().onreadystatechange).toBeDefined();
            expect($.ajaxSettings.accepts.constructor).toBe(Object);
            expect($.ajaxSettings.accepts.script).toBe('text/javascript, application/javascript');
            expect($.ajaxSettings.accepts.json).toBe('application/json');
            expect($.ajaxSettings.accepts.xml).toBe('application/xml, text/xml');
            expect($.ajaxSettings.accepts.html).toBe('text/html');
            expect($.ajaxSettings.accepts.text).toBe('text/plain');
            expect($.ajaxSettings.timeout).toBe(0);
        });
    });

    describe('$.ajaxJSONP', function () {
        it('should be defined', function () {
            expect($.ajaxJSONP).toBeDefined();
        });
    });
});
