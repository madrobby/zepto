name = "single ID"

bench = -> $ "#hello"

plain = -> [ document.getElementById "hello" ]

setup = ->
  $("#fixtures").html """
    <ul>
    <li id=hi>Hi</li>
    <li id=hello>Hello</li>
    <li id=hola>Hola</li>
    <li id=zdravo>Zdravo</li>
    </ul>
  """
