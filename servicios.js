$(document).ready(function () {
    const table = $('#example').DataTable({
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json'
        }
    });

    let contador = 1;

    // Guardar ingreso
    $('#guardarIngreso').on('click', function () {
        const placa = $('#placa').val();
        const cliente = $('#cliente').val();
        const telefono = $('#telefono').val();
        const marca = $('#marca').val();
        const modelo = $('#modelo').val();
        const tipoVehiculo = $('#tipoVehiculo').val();

        if (placa && cliente && telefono && marca && modelo && tipoVehiculo) {
            table.row.add([
                contador++,
                placa,
                marca,
                tipoVehiculo,
                cliente,
                telefono,
                'N/A',
                '<button class="btn btn-success btn-sm" title="Añadir Servicio" data-bs-toggle="modal" data-bs-target="#addServicioModal"><i class="bi bi-plus"></i></button> ' +
                '<button class="btn btn-warning btn-sm" title="Pagar"><i class="bi bi-currency-dollar"></i></button> ' +
                '<button class="btn btn-primary btn-sm" title="Editar"><i class="bi bi-pencil"></i></button> ' +
                '<button class="btn btn-danger btn-sm" title="Eliminar"><i class="bi bi-trash"></i></button>'
            ]).draw(false);

            $('#addIngresoForm')[0].reset();
            $('#addIngresoModal').modal('hide');
        } else {
            alert('Por favor, complete todos los campos.');
        }
    });

    // Pagar y mover a REALIZADOS
    $('#example tbody').on('click', '.btn-pagar', function () {
        const row = ingresosTable.row($(this).parents('tr'));
        const rowData = row.data();

        $('#detallePago').empty(); // Vaciar detalles de pago
        $('#total').val(''); // Limpiar total
        $('#metodoPago').val(''); // Limpiar método de pago
        $('#pagarModal').modal('show'); // Mostrar modal de pago

        $('#confirmarPago').off('click').on('click', function () {
            const metodoPago = $('#metodoPago').val();
            if (!metodoPago) {
                alert('Por favor, seleccione un método de pago.');
                return;
            }

            alert(`Pago realizado exitosamente usando ${metodoPago}.`);

            // Agregar fila a la tabla de REALIZADOS
            realizadosTable.row.add([
                rowData[0],
                rowData[1],
                rowData[2],
                rowData[3],
                rowData[4],
                rowData[5],
                rowData[6],
                metodoPago
            ]).draw(false);

            // Eliminar fila de INGRESOS
            row.remove().draw();

            $('#pagarModal').modal('hide');
        });
    });

    // Eliminar fila
    $('#example tbody').on('click', '.btn-eliminar', function () {
        table.row($(this).parents('tr')).remove().draw();
    });
    // Abrir modal de edición
    $('#example tbody').on('click', '.btn-editar', function () {
        const row = table.row($(this).parents('tr'));
        const rowData = row.data();
        $('#editRowIndex').val(row.index());
        $('#editPlaca').val(rowData[1]);
        $('#editMarca').val(rowData[2]);
        $('#editTipoVehiculo').val(rowData[3]);
        $('#editCliente').val(rowData[4]);
        $('#editIngresoModal').modal('show');
    });

    // Guardar cambios en la fila
    $('#guardarCambios').on('click', function () {
        const rowIndex = $('#editRowIndex').val();
        const rowData = table.row(rowIndex).data();

        rowData[1] = $('#editPlaca').val();
        rowData[2] = $('#editMarca').val();
        rowData[3] = $('#editTipoVehiculo').val();
        rowData[4] = $('#editCliente').val();

        table.row(rowIndex).data(rowData).draw(false);
        $('#editIngresoModal').modal('hide');
    });

    // Cambios dinámicos en la ventana de servicio
    $('#tipoVenta').on('change', function () {
        const tipo = $(this).val();
        $('#productoContainer').toggleClass('d-none', tipo !== 'Producto');
        $('#servicioContainer').toggleClass('d-none', tipo !== 'Servicio');
    });

    $('#tipoServicio').on('change', function () {
        const tipoServicio = $(this).val();
        $('#servicioBasicoContainer').toggleClass('d-none', tipoServicio !== 'Basico');
        $('#servicioEspecialContainer').toggleClass('d-none', tipoServicio !== 'Especial');
    });

    // Guardar servicio
    $('#addServicioModal .btn-primary').on('click', function () {
        const tipoVenta = $('#tipoVenta').val();
        const producto = $('#producto').val();
        const tipoServicio = $('#tipoServicio').val();
        const servicioBasico = $('#servicioBasico').val();
        const servicioEspecial = $('#servicioEspecial').val();
        const colaborador = $('#colaborador').val();

        let descripcionServicio = '';

        if (tipoVenta === 'Producto') {
            descripcionServicio = `Producto: ${producto}`;
        } else if (tipoVenta === 'Servicio') {
            if (tipoServicio === 'Basico') {
                descripcionServicio = `Servicio Básico: ${servicioBasico}`;
            } else if (tipoServicio === 'Especial') {
                descripcionServicio = `Servicio Especial: ${servicioEspecial}`;
            }
        }

        if (descripcionServicio && colaborador) {
            alert(`Servicio guardado:\n${descripcionServicio}\nColaborador: ${colaborador}`);

            // Aquí puedes añadir lógica para asociar el servicio con un ingreso específico.
            $('#addServicioForm')[0].reset();
            $('#addServicioModal').modal('hide');
        } else {
            alert('Por favor, complete todos los campos.');
        }
    });

    // Eliminar fila
    $('#example tbody').on('click', '.btn-danger', function () {
        if (confirm('¿Está seguro de que desea eliminar esta fila?')) {
            table.

                row($(this).parents('tr')).remove().draw();
        }
    });

    // Funcionalidad de Pago
    $('#example tbody').on('click', '.btn-warning', function () {
        $('#detallePago').empty(); // Vaciar la tabla de detalles de pago
        $('#total').val(''); // Limpiar el campo de total
        $('#metodoPago').val(''); // Restablecer el método de pago
        $('#pagarModal').modal('show'); // Mostrar el modal de pago
    });

    // Confirmar Pago
    $('#confirmarPago').on('click', function () {
        const metodoPago = $('#metodoPago').val();
        if (!metodoPago) {
            alert('Por favor, seleccione un método de pago.');
            return;
        }
        alert(`Pago realizado exitosamente usando ${metodoPago}.`);
        $('#pagarModal').modal('hide');
    });

    // Simular edición
    $('#example tbody').on('click', '.btn-primary', function () {
        alert('Funcionalidad para editar esta fila.');
    });
});