{
    loadOrderId();
}

function loadOrderId() {
    if ($("#orderId").val() == "") {
        $("#orderId").val("001");
    } else {
        var value = parseInt($("#orderId").val());
        value++;
        $("#orderId").val(value);
    }
}


$("#btnPurchase").click(function () {
    if ($("#date").val() == "") {
        $("#date").css('border', '2px solid red');
    } else {
        loadOrderId();
        $("#orderFormCustomerName,#orderFormCustomerAddress,#orderFormCustomerTp,#date").val("");
        $("#orderFormTableBody").empty();
    }

});

function loadItemId() {
    $("#orderFormItemId").empty();
    itemDB.forEach(function (e) {
        $("#orderFormItemId").append($("<option></option>").attr("value", e).text(e.getItemCode()));
    });
}

function loadCustomerId() {

    $("#orderFormCstId").empty();
    //$("#orderFormCstId").append($("<option></option>").attr("value",e).text(--select Id--));*!/
    customerDB.forEach(function (e) {
        $("#orderFormCstId").append($("<option></option>").attr("value", e).text(e.getID()));
    });

}

$("#orderFormCstId").click(function () {
    var selectedId = $("#orderFormCstId option:selected").text();
    setCustomerData(selectedId);
});

function setCustomerData(id) {
    for (var i = 0; i < customerDB.length; i++) {
        if (customerDB[i].getID() == id) {
            $("#orderFormCustomerName").val(customerDB[i].getName());
            $("#orderFormCustomerAddress").val(customerDB[i].getAddress());
            $("#orderFormCustomerTp").val(customerDB[i].getContact());
        }
    }
}

$("#orderFormItemId").click(function () {
    var selectedId = $("#orderFormItemId option:selected").text();
    setItemData(selectedId);
});

function setItemData(id) {
    for (var j = 0; j < itemDB.length; j++) {
        if (itemDB[j].getItemCode() == id) {
            $("#orderFormItemName").val(itemDB[j].getItemName());
            $("#orderFormQty").val(itemDB[j].getItemQTY());
            $("#orderFormPrice").val(itemDB[j].getPrice());
        }
    }
}


$("#btnAddItem").click(function () {
    countTotal();
    if ($("#orderFormItemId option:selected").text() == "" || $("#orderFormCstId option:selected").text() == "") {
        alert("Please select the Customer Id and Item Id");
        clearOrderItem();
    } else {
        updateItemDatabase();
        saveOrder();
        loadTable();

        $("#orderFormTableBody>tr>td>button").click(function () {
            let text = "Confirm the remove of this item..!"
            if (confirm(text)) {
                $(this).closest('tr').remove();
                let orderId = $("#orderId").val();
                let id = $(this).closest('tr').children(":eq(0)").text();
                let qty = parseInt($(this).closest('tr').children(":eq(3)").text());

                removeItem(orderId, id, qty);
            }

        });
    }

});

function removeItem(orderId, id, qty) {
    /!*update itemDB*!/
    for (let i = 0; i < itemDB.length; i++) {
        if (id == itemDB[i].getItemCode()) {
            let preQty = itemDB[i].getItemQTY();
            preQty += qty;
            itemDB[i].set(preQty);
        }
    }

    /!*update orderDB*!/
    for (let j = 0; j < OrderDB.length; j++) {
        if (id == OrderDB[j].getOrderItemId() && orderId == OrderDB[j].getOrderId()) {
            OrderDB.splice(j, 1);
        }
    }
}

function countTotal() {
    var total;
    var displayTotal = parseInt($("#total").text());
    if (displayTotal == 0) {
        total = (parseInt($("#orderQty").val())) * (parseInt($("#orderFormPrice").val()));

        $("#total").text(total + ".00 /=");
    } else {
        var sum = displayTotal + (parseInt($("#orderQty").val())) * (parseInt($("#orderFormPrice").val()));
        $("#total").text(sum + ".00 /=");
    }

    displayTotal = parseInt($("#total").text());

    if (displayTotal > 100 || displayTotal < 1000) {
        $("#txtDiscount").val("5%");
        var subTotal = displayTotal - ((displayTotal * 5) / 100);
        $("#subTotal").text(subTotal + " /=");
    } else if (displayTotal > 1000) {
        $("#txtDiscount").val("10%");
        var subTotal = displayTotal - ((displayTotal * 10) / 100);
        $("#subTotal").text(subTotal + " /=");
    }

}

function saveOrder() {
    var orderID = $("#orderId").val();
    var date = $("#date").val();
    var customerId = $("#orderFormCstId option:selected").text();
    var itemId = $("#orderFormItemId option:selected").text();
    var itemName = $("#orderFormItemName").val();
    var itemPrice = parseInt($("#orderFormPrice").val());
    var qty = parseInt($("#orderQty").val());
    var total = itemPrice * qty;

    var orderDetails = new orderDTO();
    orderDetails.setOrderId(orderID);
    orderDetails.setOrderDate(date);
    orderDetails.setOrderCustomerId(customerId);
    orderDetails.setOrderItemId(itemId);
    orderDetails.setOrderItemName(itemName);
    orderDetails.setOrderItemPrice(itemPrice);
    orderDetails.setOrderQty(qty);
    orderDetails.setTotal(total);

    var checked = false;

    function idExits() {
        for (var i = 0; i < OrderDB.length; i++) {
            if (itemId == OrderDB[i].getOrderItemId()) {
                OrderDB[i].setOrderQty(OrderDB[i].getOrderQty() + qty);
                OrderDB[i].setTotal(OrderDB[i].getTotal() + total);
                return true;
            } else {

            }
        }
        return false;
    }

    if (OrderDB.length == 0) {
        checked = false;
    } else {
        checked = idExits();
    }

    if (checked) {
        clearOrderItem();
    } else {
        OrderDB.push(orderDetails);
        clearOrderItem();
    }
}

function loadTable() {
    $("#orderFormTableBody").empty();
    OrderDB.forEach(function (a) {
        let orderRow = `<tr><td>${a.getOrderItemId()}</td><td>${a.getOrderItemName()}</td><td>${a.getOrderItemPrice()}</td><td>${a.getOrderQty()}</td><td>${a.getTotal()}</td><td><button id="delete" type="button" class="btn btn-danger ">Remove</button></td></tr>`;
        $("#orderFormTableBody").append(orderRow);
    });

}

function clearOrderItem() {
    $("#orderFormItemName,#orderQty,#orderFormPrice,#orderFormQty").val("");
    $("#btnAddItem").attr("disabled", true);
    validateOrderForm();
}

function updateItemDatabase() {
    var itemId = $("#orderFormItemId option:selected").text();
    var qty = parseInt($("#orderQty").val());
    for (let i = 0; i < itemDB.length; i++) {
        if (itemId == itemDB[i].getItemCode()) {
            var x = parseInt(itemDB[i].getItemQTY());
            x -= qty;
            itemDB[i].setItemQTY(x);
        }
    }
}

/!*========================= validation =====================================*!/

let regxQty = /^[0-9]{1,3}$/;
let regxCash = /^[0-9](.){1,6}$/;

$("#btnAddItem").attr("disabled", true);
$("#btnPurchase").attr("disabled", true);

$("#orderQty,#txtCash").on('keyup', function () {
    validateOrderForm();
});

function validateOrderForm() {
    var qty = $("#orderQty").val();

    if (regxQty.test(qty)) {
        $("#orderQty").css('border', '2px solid green');
    } else {
        $("#orderQty").css('border', '2px solid red');
        $("#btnAddItem").attr("disabled", true);
    }

    var cash = $("#txtCash").val();
    if (regxCash.test(cash)) {
        $("#txtCash").css('border', '2px solid green');
    } else {
        $("#txtCash").css('border', '2px solid red');
        $("#btnAddItem").attr("disabled", true);
    }
}

$("#orderQty").on('keyup', function (e) {
    if (e.key == "Enter") {
        if (parseInt($("#orderQty").val()) > parseInt($("#orderFormQty").val())) {
            alert("Quantity is invalid");
            /!*swal("Good job!", "You clicked the button!", "success");*!/
        } else {
            checkValidation();
        }
    }
});

$("#txtCash").on('keyup', function (e) {
    if (e.key == "Enter") {
        if (parseInt($("#total").text()) <= parseInt($("#txtCash").val())) {
            setBalance();
            checkValidation();
        } else {
            alert("Wrong Amount..! ");
        }
    }
});

function checkValidation() {
    var qty = $("#orderQty").val();
    if (regxQty.test(qty)) {
        $("#btnAddItem").attr("disabled", false);
    } else {
        $("#orderQty").focus();
    }

    var cash = $("#txtCash").val();
    if (regxCash.test(cash)) {
        $("#btnPurchase").attr("disabled", false);
    } else {
        $("#txtCash").focus();
    }
}

function setBalance() {
    var balance = parseInt($("#txtCash").val()) - parseInt($("#subTotal").text());
    $("#txtBalance").val(balance + ".00");
}
