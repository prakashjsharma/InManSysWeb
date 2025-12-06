$(function () {
    loadKpi();
    loadCharts();
    initProductsTable();
});

function loadKpi() {
    $.get("/api/dashboard/kpi")
        .done(function (data) {
            $("#kpiSuppliers").text(data.totalSuppliers);
            $("#kpiCategories").text(data.totalCategories);
            $("#kpiProducts").text(data.totalProducts);
        })
        .fail(function (xhr) { handleApiError(xhr); });
}

function loadCharts() {
    // Products by Supplier
    $.get("/api/dashboard/products-by-supplier")
        .done(function (data) {
            Highcharts.chart('chartBySupplier', {
                chart: { type: 'column' },
                title: { text: 'Products Count by Supplier' },
                xAxis: { categories: data.map(x => x.supplier) },
                yAxis: { title: { text: 'Count' } },
                legend: { enabled: false },
                series: [{
                    name: "Products",
                    data: data.map(x => x.count)
                }],
                credits: { enabled: false },
            });
        })
        .fail(function (xhr) { handleApiError(xhr); });

    // Products by Category
    $.get("/api/dashboard/products-by-category")
        .done(function (data) {
            Highcharts.chart('chartByCategory', {
                chart: { type: 'column' },
                title: { text: 'Products Count by Category' },
                xAxis: { categories: data.map(x => x.category) },
                yAxis: { title: { text: 'Count' } },
                legend: { enabled: false },
                series: [{
                    name: "Products",
                    data: data.map(x => x.count)
                }],
                credits: { enabled: false },
            });
        })
        .fail(function (xhr) { handleApiError(xhr); });
}

function initProductsTable() {
    var table = $("#dashboardProductsTable").DataTable({
        ajax: {
            url: "/api/dashboard/products-table", // or /api/products
            dataSrc: ""
        },
        columns: [
            { data: "supplier" },
            { data: "category" },
            { data: "name" },
            { data: "articleNo" },
            { data: "upcCode" },
            { data: "price", render: d => d ? d.toFixed(2) : "" },
            {
                data: "image",
                render: function (d) {
                    if (!d) return "";
                    return `<img src="${d}" style="height:40px;width:40px;object-fit:cover;border-radius:3px;" />`;
                }
            },
            {
                data: "id",
                orderable: false,
                render: function (id) {
                    return `<button class="btn btn-sm btn-primary viewBtn" data-id="${id}">View</button>`;
                }
            }
        ]
    });

    // View details
    $("#dashboardProductsTable").on("click", ".viewBtn", function () {
        var id = $(this).data("id");
        $.get("/api/products/" + id)
            .done(function (p) {
                showProductDetailsModal(p);
            })
            .fail(function (xhr) { handleApiError(xhr); });
    });
}

function showProductDetailsModal(p) {
    $("#pdName").text(p.name);
    $("#pdImage").attr("src", p.image || '/images/no-image.png');

    var rows = "";
    addRow = (k, v) => rows += `<tr><th style="width:35%">${k}</th><td>${v ?? ""}</td></tr>`;

    addRow("Article No", p.articleNo);
    addRow("UPC Code", p.upcCode);
    addRow("Supplier", p.supplier);
    addRow("Category", p.category);
    addRow("Price", p.price ? p.price.toFixed(2) : "");
    addRow("Cost Price", p.costPrice ? p.costPrice.toFixed(2) : "");
    addRow("Discount Price", p.discountPrice ? p.discountPrice.toFixed(2) : "");
    addRow("Width", p.width);
    addRow("Height", p.height);
    addRow("Depth", p.depth);
    addRow("Weight", p.weight);
    addRow("Reorder Level", p.reorderLevel);
    addRow("Shelf Life (days)", p.shelfLifeDays);
    addRow("Unit", p.unitOfMeasure);
    addRow("DO Entry", p.doEntry ? p.doEntry.split("T")[0] : "");
    addRow("DTO Entry", p.dtoEntry ? p.dtoEntry.split("T")[0] : "");
    addRow("Status", p.status ? "Active" : "Inactive");
    addRow("Description", p.description);

    $("#pdBody").html(rows);
    $("#productDetailsModal").modal("show");
}

/* ---------- reuse existing handleApiError / showToast if available ---------- */
/* If not present, include simple fallback: */
if (typeof handleApiError === "undefined") {
    function handleApiError(xhr) {
        let msg = "Unexpected error";
        if (xhr && xhr.responseJSON && xhr.responseJSON.errors) {
            let errors = xhr.responseJSON.errors;
            msg = "";
            for (let k in errors) msg += errors[k].join(", ") + "\n";
        } else if (xhr && xhr.responseText) msg = xhr.responseText;
        alert(msg);
    }
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

