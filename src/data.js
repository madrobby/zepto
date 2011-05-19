
( function( $ )
{
    var data = {},
        uuid = $.uuid = +new Date();
        exp  = $.expando = 'Zepto' + uuid;
    
    function isScalar( value )
    {
        return /boolean|number|string/.test( typeof value );
    }
    
    function getData( name )
    {
        var id = this[ 0 ][ exp ];
        
        return (
            id && data[ id ] && data[ id ][ name ]
            ? data[ id ][ name ]
            : this.dataAttr( name )
        );
    }
    
    function setData( name, value )
    {
        if( isScalar( value ) ) return this.dataAttr( name, value );
        
        var id = this[ 0 ][ exp ] = ++uuid;
        
        data[ id ]         = data[ id ] || {};
        data[ id ][ name ] = value;
        
        return this;
    };
    
    $.fn.dataAttr = $.fn.data;
    $.fn.data     = function( name, value )
    {
        return (
            value === undefined
            ? getData.call( this, name )
            : setData.call( this, name, value )
        );
    };

} )( Zepto );
