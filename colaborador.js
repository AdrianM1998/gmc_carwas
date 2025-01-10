$(document).ready(function () {
    var table = $('#example').DataTable({
        language: { url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json' }
    });

    var paymentsTable = $('#paymentsTable').DataTable({
        language: { url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json' }
    });

    var editingRow = null;
    var collaboratorsList = []; // Aquí guardamos los colaboradores

    // Función para actualizar el campo de "Seleccionar Colaborador"
    function updateCollaboratorSelect() {
        $('#collaboratorSelect').empty(); // Limpiar las opciones previas
        collaboratorsList.forEach(function (collaborator) {
            $('#collaboratorSelect').append('<li><a class="dropdown-item" href="#" data-id="' + collaborator.id + '">' + collaborator.name + '</a></li>');
        });

        // Manejar el evento click en los elementos del dropdown
        $('#collaboratorSelect .dropdown-item').click(function () {
            var selectedName = $(this).text();
            var selectedId = $(this).data('id');
            $('#collaboratorSelectButton').text(selectedName); // Actualizar el texto del botón
            $('#collaboratorSelectButton').data('id', selectedId); // Guardar el ID del colaborador seleccionado
        });
    }

    // Botón Añadir Colaborador
    $('#btnAddCollaborator').click(function () {
        editingRow = null;
        $('#collaboratorForm')[0].reset();
        $('#addModal').modal('show');
    });

    // Guardar datos de colaborador
    $('#collaboratorForm').submit(function (e) {
        e.preventDefault();
        var name = $('#name').val();
        var id = $('#id').val();
        var phone = $('#phone').val();
        var money = $('#money').val();
        if (editingRow) {
            table.row(editingRow).data([name, id, phone, money, actionButtonsCollaborators()]).draw();
        } else {
            table.row.add([name, id, phone, money, actionButtonsCollaborators()]).draw();
            collaboratorsList.push({ id: id, name: name }); // Agregar el colaborador a la lista
        }
        updateCollaboratorSelect(); // Actualizar el select de colaboradores
        $('#addModal').modal('hide');
    });

    // Botón Editar (solo en la vista de colaboradores)
    $('#example').on('click', '.edit-row', function () {
        editingRow = table.row($(this).closest('tr'));
        var data = editingRow.data();
        $('#name').val(data[0]);
        $('#id').val(data[1]);
        $('#phone').val(data[2]);
        $('#money').val(data[3]);
        $('#addModal').modal('show');
    });

    // Botón Eliminar (solo en la vista de colaboradores)
    $('#example').on('click', '.delete-row', function () {
        var data = table.row($(this).closest('tr')).data();
        // Eliminar el colaborador de la lista
        collaboratorsList = collaboratorsList.filter(function (collaborator) {
            return collaborator.id !== data[1]; // Filtra por el ID de colaborador
        });
        table.row($(this).closest('tr')).remove().draw();
        updateCollaboratorSelect(); // Actualizar el select después de eliminar un colaborador
    });

    // Función de botones en la vista de colaboradores
    function actionButtonsCollaborators() {
        return `
            <button class="btn btn-outline-success btn-sm edit-row">
                <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-outline-danger btn-sm delete-row">
                <i class="bi bi-trash"></i>
            </button>`;
    }

    // Función de botones en la vista de pagos (solo eliminar)
    function actionButtonsPayments() {
        return `
            <button class="btn btn-outline-danger btn-sm delete-row">
                <i class="bi bi-trash"></i>
            </button>`;
    }

    // Al hacer clic en el botón Pagar Sueldo
    $('#btnPaySalary').click(function () {
        updateCollaboratorSelect(); // Actualizar el select cada vez que se abra el modal
        $('#paySalaryModal').modal('show');
    });

    // Al enviar el formulario de pago
    $('#paySalaryForm').submit(function (e) {
        e.preventDefault();

        var collaboratorId = $('#collaboratorSelectButton').data('id');
        var collaboratorName = $('#collaboratorSelectButton').text();
        var amount = $('#amount').val();
        var concept = $('#conceptSelect').val();
        var paymentDate = $('#paymentDate').val();

        // Agregar el pago a la tabla de pagos
        paymentsTable.row.add([
            paymentsTable.rows().count() + 1, // Número de registro
            collaboratorName, // Nombre del colaborador
            'S/ ' + amount, // Monto en soles
            concept, // Concepto
            paymentDate, // Fecha
            actionButtonsPayments() // Botones de acción (solo eliminar)
        ]).draw();

        // Limpiar el formulario de pago
        $('#paySalaryForm')[0].reset();
        $('#paySalaryModal').modal('hide');
    });

    // Delegar el evento de eliminación a la tabla de pagos
    $('#paymentsTable').on('click', '.delete-row', function () {
        paymentsTable.row($(this).closest('tr')).remove().draw();
    });

    // Botón para cambiar a la vista de pagos
    $('#btnPayments').click(function () {
        $('#mainView').addClass('d-none');
        $('#paymentsView').removeClass('d-none');
    });

    // Botón para regresar a la vista principal
    $('#btnBackToMain').click(function () {
        $('#paymentsView').addClass('d-none');
        $('#mainView').removeClass('d-none');
    });
});