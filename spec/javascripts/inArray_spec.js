describe('$.inArray', function () {
  it('should delegate to native Array.prototype.indexOf', function () {
    spyOn(Array.prototype.indexOf, 'call')
    $.inArray(1,2,3)
    expect(Array.prototype.indexOf.call).toHaveBeenCalledWith(2,1,3)
  });
});
