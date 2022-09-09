require("colors");
const { guardarDb, leerDb } = require("./helpers/guardarArchivo");
const {
  inquirerMenu,
  pausa,
  leerInput,
  listadoTareasBorrar,
  confirmar,
  mostrarListadoCheckList,
} = require("./helpers/inquirer");
const Tareas = require("./models/tareas");

const main = async () => {
  let opt = "";
  const tareas = new Tareas();
  const tareasDb = leerDb();
  if (tareasDb) {
    tareas.cargarTareasFromArray(tareasDb);
  }
  do {
    opt = await inquirerMenu();
    switch (opt) {
      case "1":
        const desc = await leerInput("Descripción: ");
        tareas.crearTarea(desc);
        break;
      case "2":
        tareas.listadoCompleto();
        break;
      case "3":
        tareas.listarTareasXEstado();
        break;
      case "4":
        tareas.listarTareasXEstado(null);
        break;
      case "5":
        const ids = await mostrarListadoCheckList(tareas.listadoArray);
        tareas.toggleCompletadas(ids);
        break;
      case "6":
        const id = await listadoTareasBorrar(tareas.listadoArray);
        if (id !== "0") {
          const confirm = await confirmar("¿Está seguro?");
          if (confirm) {
            tareas.borrarTarea(id);
            console.log("Tarea borrada");
          }
        }

        break;
    }
    guardarDb(tareas.listadoArray);
    await pausa();
  } while (opt !== "0");
};

main();
