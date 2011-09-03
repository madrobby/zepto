describe('Ajax', function () {

    var onSuccess, onError, request;

    describe('$.ajax', function () {
        it('should be defined', function () {
            expect($.ajax).toBeDefined();
        });

        it('should returns xhr object', function () {
            expect($.ajax().constructor).toBe(XMLHttpRequest);
        });

        describe('XHR request', function () {

            beforeEach(function () {
                jasmine.Ajax.useMock();
                onSuccess = jasmine.createSpy('onSuccess');
            });

            describe('on GET request', function () {

                beforeEach(function () {
                    $.ajax({ url: '/example/url', success: onSuccess });
                    request = mostRecentAjaxRequest();
                    request.response({ status: 200, responseText: 'Small is beautiful.' });
                });

                it('should perform XHR request', function () {
                    expect(onSuccess).toHaveBeenCalled();
                });

                it('should pass responseText, success string and xhr object', function () {
                    var args = onSuccess.mostRecentCall.args;
                    expect(args.length).toEqual(3);
                    expect(args[0]).toEqual('Small is beautiful.');
                    expect(args[1]).toEqual('success');
                    expect(args[2].constructor).toEqual(FakeXMLHttpRequest);
                });
            });
        });
    });


    describe('$.get', function () {
        it('should be defined', function () {
            expect($.get).toBeDefined();
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
            expect($.ajaxSettings.xhr().constructor).toBe(XMLHttpRequest);
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
