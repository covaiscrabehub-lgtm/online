/* =========================================
   SCRAPCONNECT ADMIN
========================================= */


/* =========================================
   PRODUCTS
========================================= */

let products =
    JSON.parse(
        localStorage.getItem(
            "scrapProducts"
        )
    ) || [];



/* =========================================
   SAVE PRODUCTS
========================================= */

function saveProducts(){

    localStorage.setItem(
        "scrapProducts",
        JSON.stringify(products)
    );

}



/* =========================================
   ADD PRODUCT
========================================= */

function addProduct(){

    const name =
        document
        .getElementById(
            "productName"
        )
        .value
        .trim();


    const rate =
        document
        .getElementById(
            "productRate"
        )
        .value;


    const description =
        document
        .getElementById(
            "productDescription"
        )
        .value
        .trim();


    const file =
        document
        .getElementById(
            "productImage"
        )
        .files[0];


    if(
        !name ||
        !rate ||
        !description ||
        !file
    ){

        alert(
            "Please fill all product fields."
        );

        return;

    }


    const reader =
        new FileReader();


    reader.onload =
        function(e){

            products.push({

                id:
                    Date.now(),

                name:
                    name,

                rate:
                    Number(rate),

                description:
                    description,

                image:
                    e.target.result

            });


            saveProducts();

            loadProducts();


            document
            .getElementById(
                "productName"
            )
            .value = "";


            document
            .getElementById(
                "productRate"
            )
            .value = "";


            document
            .getElementById(
                "productDescription"
            )
            .value = "";


            document
            .getElementById(
                "productImage"
            )
            .value = "";


            alert(
                "✅ Product added successfully!"
            );

        };


    reader.readAsDataURL(file);

}



/* =========================================
   LOAD PRODUCTS
========================================= */

function loadProducts(){

    const table =
        document.getElementById(
            "productTable"
        );


    if(!table){

        return;

    }


    table.innerHTML = "";


    if(products.length === 0){

        table.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="
                    text-align:center;
                    padding:30px;
                    color:#777;
                    "
                >

                    📦 No products added yet.

                </td>

            </tr>

        `;

    }


    products.forEach(
        product => {

        table.innerHTML += `

            <tr>

                <td>

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                </td>


                <td>

                    <strong>
                        ${product.name}
                    </strong>

                </td>


                <td>

                    ${product.description}

                </td>


                <td>

                    ₹${Number(
                        product.rate
                    ).toFixed(2)}/KG

                </td>


                <td>

                    <button
                        class="edit-btn"
                        onclick="editProduct(${product.id})"
                    >

                        Edit

                    </button>


                    <button
                        class="delete-btn"
                        onclick="deleteProduct(${product.id})"
                    >

                        Delete

                    </button>

                </td>

            </tr>

        `;

    });


    document
    .getElementById(
        "productCount"
    )
    .textContent =
        products.length;

}



/* =========================================
   DELETE PRODUCT
========================================= */

function deleteProduct(id){

    if(
        !confirm(
            "Delete this product?"
        )
    ){

        return;

    }


    products =
        products.filter(
            product =>
                product.id !== id
        );


    saveProducts();

    loadProducts();

}



/* =========================================
   EDIT PRODUCT
========================================= */

function editProduct(id){

    const product =
        products.find(
            p =>
                p.id === id
        );


    if(!product){

        return;

    }


    const newName =
        prompt(
            "Product Name",
            product.name
        );


    if(
        newName === null ||
        newName.trim() === ""
    ){

        return;

    }


    const newRate =
        prompt(
            "Rate per KG",
            product.rate
        );


    if(newRate === null){

        return;

    }


    const newDescription =
        prompt(
            "Description",
            product.description
        );


    if(newDescription === null){

        return;

    }


    product.name =
        newName.trim();


    product.rate =
        Number(newRate) || 0;


    product.description =
        newDescription.trim();


    saveProducts();

    loadProducts();

}



/* =========================================
   GET PICKUP ORDERS
========================================= */

function getPickupOrders(){

    /*
        IMPORTANT:

        Customer details page saves
        data into "scrapOrders"

        NOT "scrapRequests"
    */

    return JSON.parse(
        localStorage.getItem(
            "scrapOrders"
        )
    ) || [];

}



/* =========================================
   LOAD PICKUP REQUESTS
========================================= */

function loadRequests(){

    const orders =
        getPickupOrders();


    const container =
        document.getElementById(
            "requestContainer"
        );


    if(!container){

        return;

    }


    /*
        Update counts
    */

    document
    .getElementById(
        "requestCount"
    )
    .textContent =
        orders.length;


    document
    .getElementById(
        "sideRequestCount"
    )
    .textContent =
        orders.length;


    container.innerHTML = "";


    /*
        NO REQUESTS
    */

    if(orders.length === 0){

        container.innerHTML = `

            <div class="empty-box">

                <div class="empty-icon">
                    📭
                </div>

                <h3>
                    No Pickup Requests
                </h3>

                <p style="margin-top:6px;">

                    Customer pickup requests
                    will appear here.

                </p>

            </div>

        `;


        loadRecentRequests([]);

        return;

    }


    /*
        Latest request first
    */

    const reversedOrders =
        [...orders].reverse();


    reversedOrders.forEach(
        (order,index) => {

        container.innerHTML +=
            createRequestCard(
                order,
                index,
                orders.length
            );

    });


    loadRecentRequests(
        reversedOrders
    );

}



/* =========================================
   CREATE REQUEST CARD
========================================= */

function createRequestCard(
    order,
    displayIndex,
    totalOrders
){

    const customer =
        order.customer || {};


    const location =
        customer.location || null;


    /*
        CUSTOMER DETAILS
    */

    const name =
        customer.name ||
        "Unknown Customer";


    const phone =
        customer.phone ||
        "-";


    const email =
        customer.email ||
        "-";


    const address =
        customer.address ||
        "Address not available";


    const landmark =
        customer.landmark ||
        "-";


    /*
        LOCATION
    */

    let locationHTML = "";


    if(
        location &&
        location.latitude !== undefined &&
        location.longitude !== undefined
    ){

        const latitude =
            location.latitude;


        const longitude =
            location.longitude;


        const mapURL =
            "https://www.google.com/maps?q=" +
            latitude +
            "," +
            longitude;


        locationHTML = `

            <div class="location-box">

                <h4>
                    📍 Current Pickup Location
                </h4>


                <div class="location-address">

                    ${location.address ||
                      address}

                </div>


                <div class="coordinates">

                    Latitude:
                    ${latitude}

                    <br>

                    Longitude:
                    ${longitude}

                </div>


                <a
                    href="${mapURL}"
                    target="_blank"
                    class="map-btn"
                >

                    🗺️ View Location on Map

                </a>

            </div>

        `;

    }
    else{

        locationHTML = `

            <div class="location-box">

                <h4>
                    📍 Pickup Address
                </h4>


                <div class="location-address">

                    ${address}

                </div>


                <p class="coordinates">

                    GPS location was not selected.

                </p>

            </div>

        `;

    }



    /*
        SCRAP ITEMS
    */

    let itemsHTML = "";


    let calculatedTotal =
        0;


    let calculatedWeight =
        0;


    const items =
        Array.isArray(order.items)
        ? order.items
        : [];


    items.forEach(
        item => {

        const weight =
            Number(
                item.weight
            ) || 0;


        const unit =
            String(
                item.unit || "kg"
            ).toLowerCase();


        const rate =
            Number(
                item.rate
            ) || 0;


        let kg =
            weight;


        if(unit === "g"){

            kg =
                weight / 1000;

        }


        const amount =
            kg * rate;


        calculatedWeight +=
            kg;


        calculatedTotal +=
            amount;


        itemsHTML += `

            <tr>

                <td>
                    ${item.material ||
                      "Scrap Material"}
                </td>


                <td>

                    ${weight}
                    ${unit === "g"
                        ? " G"
                        : " KG"}

                </td>


                <td>

                    ₹${rate.toFixed(2)}

                </td>


                <td>

                    ₹${amount.toFixed(2)}

                </td>

            </tr>

        `;

    });


    /*
        FALLBACK IF OLD DATA
    */

    if(items.length === 0){

        itemsHTML = `

            <tr>

                <td colspan="4">

                    No item details available

                </td>

            </tr>

        `;

    }


    /*
        TOTALS
    */

    const totalWeight =
        Number(
            order.totalWeightKg
        ) || calculatedWeight;


    const totalGrams =
        Number(
            order.totalWeightGrams
        ) ||
        Math.round(
            totalWeight * 1000
        );


    const estimatedAmount =
        Number(
            order.estimatedAmount
        ) || calculatedTotal;


    /*
        RETURN CARD
    */

    return `

        <div class="pickup-card">


            <!-- TOP -->

            <div class="pickup-top">

                <div>

                    <div class="order-id">

                        🚚
                        ${order.id ||
                          "Pickup Request"}

                    </div>


                    <div class="order-date">

                        🕐
                        ${order.date ||
                          "Date not available"}

                    </div>

                </div>


                <span class="status">

                    ${order.status ||
                      "Pickup Requested"}

                </span>

            </div>



            <!-- CUSTOMER -->

            <div class="customer-grid">


                <div class="info-box">

                    <small>
                        Customer Name
                    </small>

                    <strong>
                        👤 ${name}
                    </strong>

                </div>


                <div class="info-box">

                    <small>
                        Mobile Number
                    </small>

                    <strong>
                        📞 ${phone}
                    </strong>

                </div>


                <div class="info-box">

                    <small>
                        Email
                    </small>

                    <strong>
                        📧 ${email}
                    </strong>

                </div>


                <div class="info-box">

                    <small>
                        Landmark
                    </small>

                    <strong>
                        📌 ${landmark}
                    </strong>

                </div>

            </div>



            <!-- LOCATION -->

            ${locationHTML}



            <!-- ITEMS -->

            <div class="items-section">

                <h4>
                    ♻️ Scrap Items
                </h4>


                <table class="items-table">

                    <thead>

                        <tr>

                            <th>
                                Material
                            </th>

                            <th>
                                Weight
                            </th>

                            <th>
                                Rate
                            </th>

                            <th>
                                Amount
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        ${itemsHTML}

                    </tbody>

                </table>

            </div>



            <!-- TOTAL -->

            <div class="total-box">


                <div class="total-row">

                    <span>
                        Total Items
                    </span>

                    <strong>
                        ${order.totalItems ||
                          items.length}
                    </strong>

                </div>


                <div class="total-row">

                    <span>
                        Total Weight
                    </span>

                    <strong>

                        ${totalWeight.toFixed(3)}
                        KG

                        /

                        ${totalGrams}
                        G

                    </strong>

                </div>


                <div class="total-row">

                    <span>
                        Estimated Amount
                    </span>

                    <strong class="total-amount">

                        ₹${estimatedAmount.toFixed(2)}

                    </strong>

                </div>


            </div>



            <!-- DELETE -->

            <button
                class="delete-request"
                onclick="deleteRequest('${order.id}')"
            >

                🗑️ Delete Request

            </button>


        </div>

    `;

}



/* =========================================
   DELETE REQUEST
========================================= */

function deleteRequest(orderId){

    if(
        !confirm(
            "Are you sure you want to delete this pickup request?"
        )
    ){

        return;

    }


    let orders =
        getPickupOrders();


    orders =
        orders.filter(
            order =>
                String(order.id)
                !==
                String(orderId)
        );


    localStorage.setItem(

        "scrapOrders",

        JSON.stringify(orders)

    );


    loadRequests();

}



/* =========================================
   RECENT REQUESTS
========================================= */

function loadRecentRequests(
    orders
){

    const box =
        document.getElementById(
            "recentRequests"
        );


    if(!box){

        return;

    }


    if(
        !orders ||
        orders.length === 0
    ){

        box.innerHTML = `

            <div
                style="
                padding:25px;
                text-align:center;
                color:#777;
                "
            >

                📭 No pickup requests yet.

            </div>

        `;

        return;

    }


    const recent =
        orders.slice(0,3);


    let html = "";


    recent.forEach(
        order => {

        const customer =
            order.customer || {};


        html += `

            <div
                style="
                padding:14px 0;
                border-bottom:1px solid #eee;
                display:flex;
                justify-content:space-between;
                gap:10px;
                "
            >

                <div>

                    <strong>

                        ${customer.name ||
                          "Customer"}

                    </strong>


                    <p
                        style="
                        color:#777;
                        font-size:12px;
                        margin-top:4px;
                        "
                    >

                        ${order.id ||
                          "Pickup Request"}

                    </p>

                </div>


                <strong
                    style="
                    color:#149447;
                    "
                >

                    ₹${Number(
                        order.estimatedAmount || 0
                    ).toFixed(2)}

                </strong>

            </div>

        `;

    });


    box.innerHTML =
        html;

}



/* =========================================
   TAB SWITCHING
========================================= */

function showTab(tab){

    document
    .querySelectorAll(
        ".tab"
    )
    .forEach(
        section => {

        section.classList.remove(
            "active"
        );

    });


    const selected =
        document.getElementById(
            tab
        );


    if(selected){

        selected.classList.add(
            "active"
        );

    }


    /*
        Navigation buttons
    */

    document
    .querySelectorAll(
        ".nav-btn"
    )
    .forEach(
        button => {

        button.classList.remove(
            "active"
        );

    });


    const buttons =
        document.querySelectorAll(
            ".nav-btn"
        );


    if(tab === "dashboard"){

        buttons[0]
        ?.classList.add(
            "active"
        );

    }


    if(tab === "products"){

        buttons[1]
        ?.classList.add(
            "active"
        );

    }


    if(tab === "orders"){

        buttons[2]
        ?.classList.add(
            "active"
        );

        /*
            Always refresh when opening
            Pickup Requests.
        */

        loadRequests();

    }

}



/* =========================================
   AUTO REFRESH
========================================= */

window.addEventListener(
    "storage",
    function(event){

        if(
            event.key ===
            "scrapOrders"
        ){

            loadRequests();

        }

    }
);



/* =========================================
   START ADMIN
========================================= */

window.onload =
    function(){

        loadProducts();

        loadRequests();

    };