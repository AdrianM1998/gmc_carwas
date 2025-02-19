$(document).ready(function() {
    const table = $('#egresosTable').DataTable({
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json'
        }
    });

    function obtenerFechaActual() {
        return new Date().toISOString().split('T')[0];
    }

    function botonEliminar() {
        return `
            <button class="btn btn-danger btn-sm eliminar" title="Eliminar">
                <i class="bi bi-trash"></i>
            </button>
        `;
    }

    // Agregar nuevo egreso
    $('#egresoForm').on('submit', function(e) {
        e.preventDefault();
        const concepto = $('#concepto').val().trim();
        const monto = parseFloat($('#monto').val()).toFixed(2);
        const fecha = obtenerFechaActual();

        if (concepto && monto) {
            table.row.add([concepto, `S/ ${monto}`, fecha, botonEliminar()]).draw();
            this.reset();
        }
    });

    // Confirmación SweetAlert2 antes de eliminar
    $('#egresosTable tbody').on('click', '.eliminar', function() {
        const fila = $(this).closest('tr');
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'No se recuperará la información',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                table.row(fila).remove().draw();
                Swal.fire('Eliminado', 'El egreso ha sido eliminado.', 'success');
            }
        });
    });

    // Ajustar la tabla al cambiar de pestaña
    $('button[data-bs-target="#registros"]').on('click', function() {
        setTimeout(() => table.columns.adjust().draw(), 200);
    });
});