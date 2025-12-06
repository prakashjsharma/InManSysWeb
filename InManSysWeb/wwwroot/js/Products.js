$(function () {

    loadSuppliers();
    loadCategories();

    var table = $("#productTable").DataTable({
        ajax: {
            url: "/api/products",
            dataSrc: ""
        },
        columns: [
            { data: "name" },
            { data: "articleNo" },
            { data: "supplier" },
            { data: "category" },
            { data: "price" },
            {
                data: "status",
                render: x => x ? "Active" : "Inactive"
            },
            {
                data: null,
                render: function () {
                    return `
                        <button class='btn btn-sm btn-primary editBtn'>Edit</button>
                        <button class='btn btn-sm btn-danger deleteBtn ms-1'>Delete</button>
                    `;
                }
            }
        ]
    });

    $(document).on("click", "#btnAdd", function (e) {
        $("#productForm")[0].reset();
        $("#Id").val("");
        $("#productModal").modal("show");
    });

    // Save
    $(document).on("submit", "#productForm", function (e) {
        e.preventDefault();

        let formData = new FormData(this);
        let id = $("#Id").val();

        if (!id) {
            formData.delete("Id"); // remove invalid empty Id
        }

        let method = id ? "PUT" : "POST";
        let url = id ? "/api/products/" + id : "/api/products";

        $.ajax({
            url: url,
            method: method,
            processData: false,
            contentType: false,
            data: formData
        })
            .done(res => {
                $("#productModal").modal("hide");
                showToast("Product saved", "success");
                table.ajax.reload();
            })
            .fail(xhr => handleApiError(xhr));
    });

    $("#imageFile").on("change", function () {
        const file = this.files[0];
        if (!file) return;

        let reader = new FileReader();
        reader.onload = function (e) {
            $("#previewImage")
                .attr("src", e.target.result)
                .show();
        };
        reader.readAsDataURL(file);
    });

    // Edit
    $("#productTable").on("click", ".editBtn", function () {

        let data = table.row($(this).parents("tr")).data();

        // ========== BASIC TEXT FIELDS ==========
        $("#Id").val(data.id);
        $("#Name").val(data.name);
        $("#Description").val(data.description);
        $("#ArticleNo").val(data.articleNo);
        $("#UPCCode").val(data.upcCode);

        // ========== NUMBERS ==========
        $("#Width").val(data.width);
        $("#Height").val(data.height);
        $("#Weight").val(data.weight);
        $("#Depth").val(data.depth);

        $("#Price").val(data.price);
        $("#CostPrice").val(data.costPrice);
        $("#DiscountPrice").val(data.discountPrice);

        $("#ReorderLevel").val(data.reorderLevel);
        $("#ShelfLifeDays").val(data.shelfLifeDays);

        // ========== DROPDOWNS ==========
        $("#SupplierId").val(data.supplierId).trigger("change");
        $("#CategoryId").val(data.categoryId).trigger("change");

        // ========== STATUS (CHECKBOX) ==========
        $("#Status").prop("checked", data.status);

        // ========== IMAGE ==========
        if (data.image && data.image !== "") {
            $("#previewImage").attr("src", data.image).show();
        } else {
            $("#previewImage").hide();
        }

        // ========== OTHER FIELDS ==========
        $("#UnitOfMeasure").val(data.unitOfMeasure);
        $("#DOEntry").val(data.doEntry ? data.doEntry.split("T")[0] : "");
        $("#DTOEntry").val(data.dtoEntry ? data.dtoEntry.split("T")[0] : "");

        // Reset file input
        $("#imageFile").val("");

        // Open Modal
        $("#productModal").modal("show");
    });



    // Delete
    $("#productTable").on("click", ".deleteBtn", function () {
        let data = table.row($(this).parents("tr")).data();

        $.ajax({
            url: "/api/products/" + data.id,
            method: "DELETE"
        })
            .done(() => {
                showToast("Deleted", "success");
                table.ajax.reload();
            })
            .fail(xhr => handleApiError(xhr));
    });
});

// Dropdowns
function loadSuppliers() {
    $.get("/api/suppliers", function (data) {
        data.forEach(x => {
            $("#SupplierId").append(`<option value="${x.id}">${x.name}</option>`);
        });
    });
}

function loadCategories() {
    $.get("/api/category", function (data) {
        data.forEach(x => {
            $("#CategoryId").append(`<option value="${x.id}">${x.name}</option>`);
        });
    });
}

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

