describe('Ajax', function () {
    describe('$.ajax', function () {
        it('should be defined', function () {
            expect($.ajax).toBeDefined();
        });

        it('should returns xhr object', function () {
            expect($.ajax().constructor).toBe(XMLHttpRequest);
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
    });

    describe('$.ajaxJSONP', function () {
        it('should be defined', function () {
            expect($.ajaxJSONP).toBeDefined();
        });
    });
});
