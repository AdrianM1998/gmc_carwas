$(document).ready(function () {
    const table = $('#example').DataTable({
        columns: [
            { data: 'fecha', title: 'FECHA' },
            { data: 'dia', title: 'DÍA' },
            {
                data: 'vehiculos',
                render: function (data) {
                    return `<span class="detalle-vehiculos text-primary" style="cursor:pointer">${data}</span>`;
                },
            },
            {
                data: 'productos',
                render: function (data) {
                    return `<span class="detalle-productos text-primary" style="cursor:pointer">${data}</span>`;
                },
            },
            { data: 'total', title: 'TOTAL' },
        ],
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json',
        },
    });

    // Cargar datos desde la base de datos
    function cargarDatos() {
        // Aquí debes hacer la llamada AJAX para obtener los datos de tu base de datos.
        // Por ejemplo:
        $.ajax({
            url: 'ruta_a_tu_script_php_o_api',  // Cambia esta URL a la de tu script que devuelve los datos
            method: 'GET',
            success: function (data) {
                table.clear().rows.add(data).draw();  // Rellena la tabla con los datos
            },
            error: function () {
                alert("Hubo un error al cargar los datos.");
            }
        });
    }

    // Cargar los datos al inicio
    cargarDatos();

    // Función para agrupar datos por semana
    function agruparPorSemana(datos) {
        const semanas = {};
        datos.forEach((d) => {
            const fecha = new Date(d.fecha);
            const inicioSemana = new Date(fecha.setDate(fecha.getDate() - fecha.getDay() + 1)); // Lunes de la semana
            const finSemana = new Date(inicioSemana);
            finSemana.setDate(inicioSemana.getDate() + 6); // Domingo de la semana

            const claveSemana = `${inicioSemana.toISOString().split('T')[0]} a ${finSemana.toISOString().split('T')[0]}`;

            if (!semanas[claveSemana]) {
                semanas[claveSemana] = {
                    fecha: claveSemana,
                    dia: 'Lunes - Domingo',
                    vehiculos: 0,
                    productos: 0,
                    total: 0,
                    detallesVehiculos: [],
                    detallesProductos: []
                };
            }

            semanas[claveSemana].vehiculos += d.vehiculos;
            semanas[claveSemana].productos += d.productos;
            semanas[claveSemana].total += d.total;
            semanas[claveSemana].detallesVehiculos.push(...d.detallesVehiculos);
            semanas[claveSemana].detallesProductos.push(...d.detallesProductos);
        });

        return Object.values(semanas);
    }

    // Función para agrupar datos por mes
    function agruparPorMes(datos) {
        const meses = {};
        datos.forEach((d) => {
            const fecha = new Date(d.fecha);
            const mesClave = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
            const inicioMes = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
            const finMes = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);

            if (!meses[mesClave]) {
                meses[mesClave] = {
                    fecha: `${inicioMes.toISOString().split('T')[0]} a ${finMes.toISOString().split('T')[0]}`,
                    dia: 'Mes Completo',
                    vehiculos: 0,
                    productos: 0,
                    total: 0,
                    detallesVehiculos: [],
                    detallesProductos: []
                };
            }

            meses[mesClave].vehiculos += d.vehiculos;
            meses[mesClave].productos += d.productos;
            meses[mesClave].total += d.total;
            meses[mesClave].detallesVehiculos.push(...d.detallesVehiculos);
            meses[mesClave].detallesProductos.push(...d.detallesProductos);
        });

        return Object.values(meses);
    }

    // Aplicar filtro
    $('#aplicarFiltro').on('click', function () {
        const filtro = $('#filtro').val();
        let datosFiltrados = [];

        if (filtro === 'semana') {
            datosFiltrados = agruparPorSemana(datos);
        } else if (filtro === 'mes') {
            datosFiltrados = agruparPorMes(datos);
        }

        table.clear().rows.add(datosFiltrados).draw();
        const modal = bootstrap.Modal.getInstance(document.getElementById('filtroModal'));
        modal.hide();
    });

    // Quitar filtro
    $('#quitarFiltro').on('click', function () {
        cargarDatos();  // Recargar los datos de la base de datos
    });

    // Eventos de clic para vehículos y productos
    $('#example tbody').on('click', '.detalle-vehiculos', function () {
        const row = table.row($(this).closest('tr')).data();
        $('#vehiculosDetalle').html(row.detallesVehiculos.map(v => `<li>${v}</li>`).join(''));
        new bootstrap.Modal('#vehiculosModal').show();
    });

    $('#example tbody').on('click', '.detalle-productos', function () {
        const row = table.row($(this).closest('tr')).data();
        $('#productosDetalle').html(row.detallesProductos.map(p => `<li>${p.nombre} - S/ ${p.precio}</li>`).join(''));
        new bootstrap.Modal('#productosModal').show();
    });
});