$(document).ready(function () {
    const clientTable = $('#clientTable').DataTable({
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json'
        },
        columnDefs: [
            { orderable: false, targets: 5 } // Desactivar ordenamiento para la columna de acciones
        ]
    });

    // Configuración inicial de la tabla CLASIFICADOR
const clasificadorTable = $('#clasificadorTable').DataTable({
language: {
url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json'
},
columnDefs: [
{ orderable: false, targets: 2 } // Desactivar ordenamiento para la columna de acciones
]
});

   $('#addClientModal').on('show.bs.modal', function () {
$('#addClientForm')[0].reset(); // Limpiar campos del formulario
$('#addClientForm').removeData('editingRow'); // Limpiar referencia de edición
$('#addClientModalLabel').text('Añadir Cliente'); // Cambiar el título del modal
});

    // Añadir o editar cliente
    $('#addClientForm').on('submit', function (e) {
        e.preventDefault();

        const clientName = $('#clientName').val().trim();
        const clientDNI = $('#clientDNI').val().trim();
        const clientPhone = $('#clientPhone').val().trim();
        const clientPlate = $('#clientPlate').val().trim();

        if (clientName === "" || clientDNI === "" || clientPhone === "" || clientPlate === "") {
            alert("Por favor, complete todos los campos.");
            return;
        }

        const editingRow = $('#addClientForm').data('editingRow');

        if (editingRow !== undefined) {
            // Actualizar cliente existente
            clientTable.row(editingRow).data([
                editingRow + 1,
                clientName,
                clientDNI,
                clientPhone,
                clientPlate,
                '<button class="btn btn-sm btn-warning edit-btn"><i class="fa fa-edit"></i></button>' +
                '<button class="btn btn-sm btn-danger delete-btn"><i class="fa fa-trash"></i></button>'
            ]).draw();
        } else {
            // Añadir nuevo cliente
            clientTable.row.add([
                clientTable.rows().count() + 1,
                clientName,
                clientDNI,
                clientPhone,
                clientPlate,
                '<button class="btn btn-sm btn-warning edit-btn"><i class="fa fa-edit"></i></button>' +
                '<button class="btn btn-sm btn-danger delete-btn"><i class="fa fa-trash"></i></button>'
            ]).draw();
        }

        $('#addClientModal').modal('hide');
        $('#addClientForm')[0].reset();
        $('#addClientForm').removeData('editingRow'); // Quitar referencia de edición
    });

    // Editar cliente
    $('#clientTable').on('click', '.edit-btn', function () {
        const row = $(this).closest('tr');
        const rowIndex = clientTable.row(row).index();
        const rowData = clientTable.row(row).data();

        if (!rowData) return;

        $('#clientName').val(rowData[1]);
        $('#clientDNI').val(rowData[2]);
        $('#clientPhone').val(rowData[3]);
        $('#clientPlate').val(rowData[4]);

        $('#addClientForm').data('editingRow', rowIndex);

        $('#addClientModalLabel').text('Editar Cliente');
        $('#addClientModal').modal('show');
    });

    // Eliminar cliente
    $('#clientTable').on('click', '.delete-btn', function () {
        const row = $(this).closest('tr');
        clientTable.row(row).remove().draw();

        // Reordenar filas después de eliminar
        clientTable.rows().every(function (rowIdx) {
            const row = this.node();
            const rowData = this.data();
            rowData[0] = rowIdx + 1;
            this.data(rowData);
        }).draw();
        
    });
    
// Añadir o editar tipo de vehículo
$('#addVehicleTypeForm').on('submit', function (e) {
e.preventDefault(); // Evitar el envío del formulario

const vehicleType = $('#vehicleType').val().trim(); // Obtener el valor del campo

if (vehicleType === "") {
alert("Por favor, seleccione un tipo de vehículo.");
return;
}

const editingRow = $('#addVehicleTypeForm').data('editingRow'); // Obtener el índice de la fila editada

if (editingRow !== undefined) {
// Si existe un índice, actualizar la fila
clasificadorTable.row(editingRow).data([
    editingRow + 1, // Actualizar el índice de fila
    vehicleType,    // Nuevo valor del tipo de vehículo
    '<button class="btn btn-sm btn-warning edit-btn"><i class="fa fa-edit"></i></button>' +
    '<button class="btn btn-sm btn-danger delete-btn"><i class="fa fa-trash"></i></button>'
]).draw(); // Dibujar la tabla con los nuevos datos
} else {
// Si no existe un índice, significa que es un nuevo tipo de vehículo
clasificadorTable.row.add([
    clasificadorTable.rows().count() + 1, // Asignar un nuevo índice
    vehicleType,                          // Nombre del nuevo tipo de vehículo
    '<button class="btn btn-sm btn-warning edit-btn"><i class="fa fa-edit"></i></button>' +
    '<button class="btn btn-sm btn-danger delete-btn"><i class="fa fa-trash"></i></button>'
]).draw();
}

// Ocultar el modal y limpiar el formulario
$('#addVehicleTypeModal').modal('hide');
$('#addVehicleTypeForm')[0].reset();
$('#addVehicleTypeForm').removeData('editingRow'); // Limpiar el índice de edición
$('#addVehicleTypeModalLabel').text('Añadir Tipo de Vehículo'); // Restablecer el título del modal
});

// Editar tipo de vehículo
$('#clasificadorTable').on('click', '.edit-btn', function () {
const row = $(this).closest('tr'); // Obtener la fila donde se hizo clic
const rowData = clasificadorTable.row(row).data(); // Obtener los datos de la fila

if (!rowData) return; // Verificar si la fila tiene datos

$('#vehicleType').val(rowData[1]); // Cargar el tipo de vehículo en el formulario

// Guardar el índice de la fila seleccionada en el formulario
$('#addVehicleTypeForm').data('editingRow', clasificadorTable.row(row).index());

// Cambiar el título del modal a "Editar Tipo de Vehículo"
$('#addVehicleTypeModalLabel').text('Editar Tipo de Vehículo');

// Mostrar el modal
$('#addVehicleTypeModal').modal('show');
});

// Eliminar tipo de vehículo
$('#clasificadorTable').on('click', '.delete-btn', function () {
const row = $(this).closest('tr'); // Obtener la fila seleccionada
clasificadorTable.row(row).remove().draw(); // Eliminar la fila y redibujar la tabla

// Actualizar los índices después de la eliminación
clasificadorTable.rows().every(function (rowIdx) {
const rowData = this.data(); // Obtener los datos de la fila actual
rowData[0] = rowIdx + 1;    // Actualizar el índice con el nuevo valor
this.data(rowData);         // Aplicar los nuevos datos a la fila
}).draw(); // Redibujar la tabla con los índices actualizados
});

   // Configuración inicial de la tabla MARCA
const marcaTable = $('#marcaTable').DataTable({
language: {
url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json'
},
columnDefs: [
{ orderable: false, targets: 2 } // Desactivar ordenamiento para la columna de acciones
]
});

// Editar marca
$('#marcaTable').on('click', '.edit-btn', function () {
const row = $(this).closest('tr'); // Obtener la fila donde se hizo clic
const rowData = marcaTable.row(row).data(); // Obtener los datos de la fila

if (!rowData) return; // Verificar si la fila tiene datos

$('#brandName').val(rowData[1]); // Cargar el nombre de la marca en el formulario

// Guardar el índice de la fila seleccionada en el formulario
$('#addBrandForm').data('editingRow', row.index());

// Cambiar el título del modal a "Editar Marca"
$('#addBrandModalLabel').text('Editar Marca');

// Mostrar el modal
$('#addBrandModal').modal('show');
});

// Añadir o editar marca
$('#addBrandForm').on('submit', function (e) {
e.preventDefault(); // Evitar el envío del formulario

const brandName = $('#brandName').val().trim(); // Obtener el valor del campo Marca

if (brandName === "") {
alert("Por favor, complete el campo Marca.");
return;
}

const editingRow = $('#addBrandForm').data('editingRow'); // Obtener el índice de la fila editada

if (editingRow !== undefined) {
// Si existe un índice, actualizar la fila
marcaTable.row(editingRow).data([
    editingRow + 1, // Actualizar el índice de fila
    brandName,      // Nuevo valor de la marca
    '<button class="btn btn-sm btn-warning edit-btn"><i class="fa fa-edit"></i></button>' +
    '<button class="btn btn-sm btn-danger delete-btn"><i class="fa fa-trash"></i></button>'
]).draw(); // Dibujar la tabla con los nuevos datos
} else {
// Si no existe un índice, significa que es una nueva marca
marcaTable.row.add([
    marcaTable.rows().count() + 1, // Asignar un nuevo índice
    brandName,                    // Nombre de la nueva marca
    '<button class="btn btn-sm btn-warning edit-btn"><i class="fa fa-edit"></i></button>' +
    '<button class="btn btn-sm btn-danger delete-btn"><i class="fa fa-trash"></i></button>'
]).draw();
}

// Ocultar el modal y limpiar el formulario
$('#addBrandModal').modal('hide');
$('#addBrandForm')[0].reset();
$('#addBrandForm').removeData('editingRow'); // Limpiar el índice de edición
$('#addBrandModalLabel').text('Añadir Marca'); // Restablecer el título del modal
});

// Eliminar marca
$('#marcaTable').on('click', '.delete-btn', function () {
const row = $(this).closest('tr'); // Obtener la fila seleccionada
marcaTable.row(row).remove().draw(); // Eliminar la fila y redibujar la tabla

// Actualizar los índices después de la eliminación
marcaTable.rows().every(function (rowIdx, tableLoop, rowLoop) {
const rowData = this.data(); // Obtener los datos de la fila actual
rowData[0] = rowIdx + 1;    // Actualizar el índice con el nuevo valor
this.data(rowData);         // Aplicar los nuevos datos a la fila
}).draw(); // Redibujar la tabla con los índices actualizados
});
});