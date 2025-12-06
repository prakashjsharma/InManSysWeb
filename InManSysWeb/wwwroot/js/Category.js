$(function () {
    var table = $('#categoryTable').DataTable({
        ajax: {
            url: '/api/category',
            dataSrc: ''
        },
        columns: [
            { data: 'id' },
            { data: 'name' },
            { data: 'description' },
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
        $('#categoryForm')[0].reset();
        $('#Id').val('');
        $('#categoryModal').modal('show');
    });

    // Save (create or update)
    $(document).on('submit', '#categoryForm', function (e) {
        e.preventDefault();
        var category = {
            id: $('#Id').val() ? parseInt($('#Id').val()) : 0,
            name: $('#Category').val(),
            description: $('#Description').val()
        };

        if (category.id === 0) {
            $.ajax({
                url: '/api/category',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(category)
            }).done(function () {
                $('#categoryModal').modal('hide');
                showToast("Category created successfully", "success");
                table.ajax.reload();
            }).fail(handleApiError);
        } else {
            $.ajax({
                url: '/api/category/' + category.id,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(category)
            }).done(function () {
                $('#categoryModal').modal('hide');
                showToast("Category updated successfully", "success");
                table.ajax.reload();
            }).fail(handleApiError);
        }
    });

    // Edit
    $('#categoryTable tbody').on('click', '.editBtn', function () {
        var data = table.row($(this).parents('tr')).data();
        $('#Id').val(data.id);
        $('#Category').val(data.name);
        $('#Description').val(data.description);

        $('#categoryModal').modal('show');
    });

    // Delete
    let deleteId = 0;
    $('#categoryTable tbody').on('click', '.deleteBtn', function () {
        var data = table.row($(this).parents('tr')).data();
        deleteId = data.id;
        $('#confirmDeleteModal').modal('show');
    });

    $(document).on('click', '#confirmDeleteBtn', function () {
        $.ajax({
            url: '/api/category/' + deleteId,
            method: 'DELETE'
        }).done(function () {
            $('#confirmDeleteModal').modal('hide');
            showToast("Category deleted successfully", "success");
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

