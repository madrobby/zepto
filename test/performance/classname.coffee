name = "single classname"

bench = -> $ ".hi"

plain = -> document.getElementsByClassName "hi"

setup = ->
  $("#fixtures").html """
    <ul>
    <li class=hi>Hi</li>
    <li class=hi>Hello</li>
    <li class=hi>Hola</li>
    <li class=hi>Zdravo
      <ul>
      <li class=hi>Bok</li>
      <li class=hi>Bonjour</li>
      <li class=hi>Hallo</li>
      </ul>
    </li>
    </ul>
  """
