// Inicialización de DataTables
$(document).ready(function() {
    const table = $('#example').DataTable({
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json'
        },
        "columnDefs": [{
            "targets": 0,
            "orderable": false
        }]
    });

    let counter = 1; // Contador para el número de filas

    // Manejar el envío del formulario para añadir producto
    $('#addProductForm').on('submit', function(event) {
        event.preventDefault(); // Evitar el envío del formulario

        // Obtener valores de los campos
        const productName = $('#productName').val();
        const productBrand = $('#productBrand').val();
        const productCategory = $('#productCategory').val();
        const productCost = parseFloat($('#productCost').val()).toFixed(2);
        const productPrice = parseFloat($('#productPrice').val()).toFixed(2);
        const productStock = parseInt($('#productStock').val(), 10);

        // Añadir nueva fila a la tabla
        table.row.add([
            counter++,
            productName,
            productBrand,
            productCategory,
            productCost,
            productPrice,
            productStock,
            `<button class="btn btn-warning btn-sm edit-btn"><i class="bi bi-pencil"></i></button>
             <button class="btn btn-danger btn-sm delete-btn"><i class="bi bi-trash"></i></button>`
        ]).draw();

        // Cerrar el modal
        $('#addProductModal').modal('hide');

        // Limpiar el formulario
        $('#addProductForm')[0].reset();
    });

    // Manejar la eliminación de un producto
    $('#example tbody').on('click', '.delete-btn', function() {
        const row = $(this).parents('tr');
        table.row(row).remove().draw();

        // Actualizar el contador para que continúe desde el número adecuado
        counter = table.rows().count() + 1;

        // Actualizar los índices de la tabla después de la eliminación
        $('#example tbody tr').each(function(index) {
            const row = $(this);
            row.find('td').eq(0).text(index + 1);  // Actualizar el número de fila
        });
    });

    // Manejar la edición de un producto
    $('#example tbody').on('click', '.edit-btn', function() {
        const row = table.row($(this).parents('tr'));
        const rowData = row.data();

        // Rellenar el modal de edición con los datos actuales
        $('#editProductName').val(rowData[1]);
        $('#editProductBrand').val(rowData[2]);
        $('#editProductCategory').val(rowData[3]);
        $('#editProductCost').val(rowData[4]);
        $('#editProductPrice').val(rowData[5]);
        $('#editProductStock').val(rowData[6]);

        // Mostrar el modal de edición
        $('#editProductModal').modal('show');

        // Manejar el envío del formulario de edición
        $('#editProductForm').off('submit').on('submit', function(event) {
            event.preventDefault();

            // Actualizar los datos de la fila
            rowData[1] = $('#editProductName').val();
            rowData[2] = $('#editProductBrand').val();
            rowData[3] = $('#editProductCategory').val();
            rowData[4] = parseFloat($('#editProductCost').val()).toFixed(2);
            rowData[5] = parseFloat($('#editProductPrice').val()).toFixed(2);
            rowData[6] = parseInt($('#editProductStock').val(), 10);

            row.data(rowData).draw();

            // Cerrar el modal
            $('#editProductModal').modal('hide');
        });
    });
});