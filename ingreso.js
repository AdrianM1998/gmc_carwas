$(document).ready(function() {
    var table = $('#ingresos').DataTable();

    function actualizarTotal() {
        var total = 0;
        table.rows({ search: 'applied' }).nodes().to$().find('.semanal').each(function() {
            var valor = $(this).text().replace('S/', '').trim();
            if (valor) {
                total += parseFloat(valor);
            }
        });
        $('#totalMes').text('S/ ' + total.toFixed(2));
    }

    $('#openFilterModal').click(function() {
        $('#filterModal').modal('show');
    });

    $('#applyFilter').click(function() {
        var selectedMonth = $('#monthSelect').val();
        table.column(0).search(selectedMonth + '/2025', true, false).draw();
        $('#filterModal').modal('hide');
        setTimeout(actualizarTotal, 500);
    });

    actualizarTotal();
});