// Datos de cada mes (puedes ampliar esta lista)
const datosMeses = {
    "Enero": [],
    "Febrero": [],
    "Marzo": [],
    "Abril": [],
    "Mayo": [],
    "Junio": [],
    "Julio": [],
    "Agosto": [],
    "Septiembre": [],
    "Octubre": [],
    "Noviembre": [],
    "Diciembre": []
};
    // Función para actualizar la tabla con los datos del mes seleccionado
    function actualizarTabla(mes) {
        let tabla = $("#tabla-datos");
        let totalIngreso = 0, totalEgreso = 0;

        tabla.empty(); // Vaciar la tabla
        datosMeses[mes].forEach(item => {
            let subTotal = item.ingreso - item.egreso;
            totalIngreso += item.ingreso;
            totalEgreso += item.egreso;

            tabla.append(`
                <tr>
                    <td>${item.semana}</td>
                    <td>S/ ${item.ingreso}</td>
                    <td>S/ ${item.egreso}</td>
                    <td>S/ ${subTotal}</td>
                </tr>
            `);
        });

        // Actualizar los totales
        $("#total-ingreso").text(`S/ ${totalIngreso}`);
        $("#total-egreso").text(`S/ ${totalEgreso}`);
        $("#total-subtotal").text(`S/ ${totalIngreso - totalEgreso}`);
        $("#titulo-mes").text(mes);
    }

    // Inicializar la tabla con los datos de Febrero por defecto
    $(document).ready(function() {
        actualizarTabla("Febrero");

        $('#ingresos').DataTable({
            paging: false,
            searching: false,
            ordering: false,
            info: false,
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json'
            }
        });

        // Manejar el clic en las opciones del modal
        $(document).on("click", ".mes-opcion", function() {
            let mesSeleccionado = $(this).data("mes");

            if (datosMeses[mesSeleccionado]) {
                actualizarTabla(mesSeleccionado);
            } else {
                alert("No hay datos disponibles para " + mesSeleccionado);
            }

            $("#modalFiltro").modal('hide');
        });
    });