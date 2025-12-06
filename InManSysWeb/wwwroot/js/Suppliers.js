$(function () {
    var table = $('#suppliersTable').DataTable({
        ajax: {
            url: '/api/suppliers',
            dataSrc: ''
        },
        columns: [
            { data: 'id' },
            { data: 'name' },
            { data: 'phone' },
            { data: 'email' },
            {
                data: 'isActive',
                render: function (d) { return d ? 'Yes' : 'No'; }
            },
            {
                data: null,
                orderable: false,
                render: function (data) {
                    return '<button class="btn btn-sm btn-primary editBtn me-1">Edit</button>'
                        + '<button class="btn btn-sm btn-danger deleteBtn">Delete</button>';
                }
            }
        ]
    });

    $(document).on('click', '#btnAdd', function () {
        $('#supplierForm')[0].reset();
        $('#Id').val('');
        $('#supplierModal').modal('show');
    });

    // Save (create or update)
        $(document).on('submit', '#supplierForm', function (e) {
        e.preventDefault();
        var supplier = {
            id: $('#Id').val() ? parseInt($('#Id').val()) : 0,
            name: $('#Name').val(),
            address: $('#Address').val(),
            phone: $('#Phone').val(),
            email: $('#Email').val(),
            isActive: $('#IsActive').is(':checked')
        };

        if (supplier.id === 0) {
            $.ajax({
                url: '/api/suppliers',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(supplier)
            }).done(function () {
                $('#supplierModal').modal('hide');
                showToast("Supplier created successfully", "success");
                table.ajax.reload();
            }).fail(handleApiError);
        } else {
            $.ajax({
                url: '/api/suppliers/' + supplier.id,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(supplier)
            }).done(function () {
                $('#supplierModal').modal('hide');
                showToast("Supplier updated successfully", "success");
                table.ajax.reload();
            }).fail(handleApiError);
        }
    });

    // Edit
    $('#suppliersTable tbody').on('click', '.editBtn', function () {
        var data = table.row($(this).parents('tr')).data();
        $('#Id').val(data.id);
        $('#Name').val(data.name);
        $('#Address').val(data.address);
        $('#Phone').val(data.phone);
        $('#Email').val(data.email);
        $('#IsActive').prop('checked', data.isActive);
        $('#supplierModal').modal('show');
    });

    // Delete
    let deleteId = 0;
    $('#suppliersTable tbody').on('click', '.deleteBtn', function () {
        var data = table.row($(this).parents('tr')).data();
        deleteId = data.id;
        $('#confirmDeleteModal').modal('show');
    });

    $(document).on('click', '#confirmDeleteBtn', function () {
        $.ajax({
            url: '/api/suppliers/' + deleteId,
            method: 'DELETE'
        }).done(function () {
            $('#confirmDeleteModal').modal('hide');
            showToast("Supplier deleted successfully", "success");
            table.ajax.reload(null, false);
        }).fail(handleApiError);
    });
});

function handleApiError(xhr) {
    let msg = "";

    if (xhr.status === 400 && xhr.responseJSON && xhr.responseJSON.errors) {
        let errors = xhr.responseJSON.errors;
        for (let key in errors) {
            msg += errors[key].join(", ") + "\n";
        }
    }
    else if (xhr.status === 409) msg = xhr.responseText || "Duplicate entry";
    else if (xhr.status === 404) msg = xhr.responseText || "Not found";
    else if (xhr.status === 401) msg = "Unauthorized. Please login.";
    else if (xhr.status === 403) msg = "Forbidden access.";
    else if (xhr.status === 500) msg = "Server error. Try again.";
    else msg = xhr.responseText || "Unexpected error occurred.";

    showToast(msg, "error");
}

function showToast(message, type = "success") {
    let toastEl = $("#appToast");
    let iconEl = $("#appToastIcon");
    let typeEl = $("#appToastType");

    // Reset classes
    //toastEl.removeClass("text-bg-success text-bg-danger");
    iconEl.removeClass().html("");

    // Success toast
    if (type === "success") {
        //toastEl.addClass("bg-success text-light");

        iconEl.addClass("rounded me-2 bg-success text-light").html("✔️"); // green check
        typeEl.html("Success"); // Msg Type 
    }
    // Error toast
    else {
        //toastEl.addClass("bg-danger text-light");

        iconEl.addClass("rounded me-2 bg-danger text-light").html("❌"); // red cross
        typeEl.html("Error"); // Msg Type 
    }

    $("#appToastBody").text(message);

    let toast = new bootstrap.Toast(toastEl[0]);
    toast.show();
}

