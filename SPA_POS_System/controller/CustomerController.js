var regExCusID = /^(C00-)[0-9]{3,4}$/;

function loadAllCustomer() {
    $("#customerTable").empty();
    for (let i = 0; i < customerDB.length; i++) {
        let customerID = customerDB[i].getID();
        let customerName =customerDB[i].getName();
        let customerAddress = customerDB[i].getAddress();
        let Contact = customerDB[i].getContact();


        let row = `<tr><td>${customerID}</td><td>${customerName}</td><td>${customerAddress}</td><td>${Contact}</td></tr>`;


        $("#customerTable").append(row);    }
}

$("#addCustomer").click(function ( ){
    saveCustomer();
    loadAllCustomer();

});

function saveCustomer(){
    let customerID = $("#cusID").val();
    let customerName = $("#cusName").val();
    let customerAddress = $("#cusAddress").val();
    let customerTP = $("#contact").val();

    var Customer= new CustomerDTO(customerID,customerName,customerAddress,customerTP);
    customerDB.push(Customer);
}


$("#cusID").keyup(function () {
    let input = $("#cusID").val();
    if (regExCusID.test(input)) {
        $("#cusID").css('border', '2px solid green');
        $("#error").text("");
    } else {
        $("#cusID").css('border', '2px solid red');
        $("#error").text("Wrong format : C00-001");
    }
});