<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Editar Agenda</title>
</head>
<body>
  <h1>Editar Agenda</h1>
  <form action="/reg_agenda/editar/<%= agenda.id %>" method="POST">
  <label for="nombre">Nombres:</label>
    <input
      type="text"
      name="nombres"
      id="nombres"
      value="<%= usuario.nombres %>"
      required
    />
    <br />
    <label for="apellidos">Nombre:</label>
    <input
      type="text"
      name="apellidos"
      id="apellidos"
      value="<%= usuario.apellidos %>"
      required
    />
    <br />
    <label for="direccion">direccion</label>
    <input
      type="text"
      name="direccion"
      id="direccion"
      value="<%= usuario.direccion %>"
      required
    />
    <br />
    <label for="telefono">telefono:</label>
    <input
      type="text"
      name="telefono"
      id="telefono"
      value="<%= usuario.telefono %>"
      required
    />
    <br />  
    <button type="submit">Guardar</button>
  </form>
  <a href="/">Volver</a>
</body>
</html>
