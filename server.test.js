const {
    validate,
    createElement,
    findRecord,
    deleteRecord,
    save,
    update,
    ms
} = require("./server");

test("Validates correct data", function () {
    const body = {
        "Maker": "Chrysler",
        "Genmodel": "300C",
        "Adv_year": 2018,
        "Color": "Black",
        "Runned_Miles": 157950,
        "Price": 5495
    }
    const result = validate(body);

    expect(result["success"]).toBeTruthy();
    expect(result["errors"]).toEqual([]);
});

test("Validates wrong Maker", function () {
    const body = {
        "Maker": "",
        "Genmodel": "300C",
        "Adv_year": 2018,
        "Color": "Black",
        "Runned_Miles": 157950,
        "Price": 5495
    }
    const result = validate(body);

    expect(result["success"]).toBeFalsy();
    expect(result["errors"]).toEqual(['Maker is entered incorrectly']);
});

test("Validates wrong Model", function () {
    const body = {
        "Maker": "Chrysler",
        "Genmodel": "",
        "Adv_year": 2018,
        "Color": "Black",
        "Runned_Miles": 157950,
        "Price": 5495
    }
    const result = validate(body);

    expect(result["success"]).toBeFalsy();
    expect(result["errors"]).toEqual(['Model is entered incorrectly']);
});

test("Validates wrong year", function () {
    const body = {
        "Maker": "Chrysler",
        "Genmodel": "300C",
        "Adv_year": 20,
        "Color": "Black",
        "Runned_Miles": 157950,
        "Price": 5495
    }
    const result = validate(body);

    expect(result["success"]).toBeFalsy();
    expect(result["errors"]).toEqual(['Year is entered incorrectly']);
});

test("Validates wrong color", function () {
    const body = {
        "Maker": "Chrysler",
        "Genmodel": "300C",
        "Adv_year": 2000,
        "Color": "",
        "Runned_Miles": 157950,
        "Price": 5495
    }
    const result = validate(body);

    expect(result["success"]).toBeFalsy();
    expect(result["errors"]).toEqual(['Color is entered incorrectly']);
});

test("Validates wrong mileage", function () {
    const body = {
        "Maker": "Chrysler",
        "Genmodel": "300C",
        "Adv_year": 2000,
        "Color": "Black",
        "Price": 5495
    }
    const result = validate(body);

    expect(result["success"]).toBeFalsy();
    expect(result["errors"]).toEqual(['Mileage is entered incorrectly']);
});

test("Validates wrong price", function () {
    const body = {
        "Maker": "Chrysler",
        "Genmodel": "300C",
        "Adv_year": 2000,
        "Color": "Black",
        "Runned_Miles": 157950,
        "Price": 0
    }
    const result = validate(body);

    expect(result["success"]).toBeFalsy();
    expect(result["errors"]).toEqual(['Price is entered incorrectly']);
});

test("It finds", function () {
    body = {
        "Adv_ID": "18_10$$92",
        "Adv_month": 6,
        "Adv_year": 2018,
        "Bodytype": "MPV",
        "Color": "Beige",
        "Door_num": 5,
        "Engin_size": "1.6L",
        "Fuel_type": "Diesel",
        "Gearbox": "Manual",
        "Genmodel": "C3 Picasso",
        "Genmodel_ID": "18_10",
        "Maker": "Citroen",
        "Price": 1490,
        "Reg_year": 2009,
        "Runned_Miles": 99000,
        "Seat_num": 5
    }
    const found = findRecord(5);
    expect(found).toEqual(body);
});

test("It saves", function () {
    const body = {
        "Maker": "Chrysler",
        "Genmodel": "300C",
        "Adv_year": 2000,
        "Color": "Black",
        "Runned_Miles": 157950,
        "Price": 3330
    }
    expect(ms.cars.length).toBe(20);
    save(body);
    expect(ms.cars.length).toBe(21);
    expect(ms.cars[20]).toEqual(body);
});

test("It updates", function () {
    const body = {
        "Maker": "Foo",
        "Genmodel": "Bar",
        "Adv_year": 1999,
        "Color": "Yellow",
        "Runned_Miles": 123123,
        "Price": 3330
    }
    expect(ms.cars.length).toBe(21);
    update(2, body);
    expect(ms.cars.length).toBe(21);
    expect(ms.cars[2]).toEqual(body);
});

test("It deletes", function () {
    expect(ms.cars.length).toBe(21);
    deleteRecord(2);
    expect(ms.cars.length).toBe(20);
});

test("It creates element", function () {
    const body = {
        "maker": "Foo",
        "model": "Bar",
        "year": 1999,
        "color": "Yellow",
        "mileage": 123123,
        "price": 3330
    }
    const expected = {
        "Maker": "Foo",
        "Genmodel": "Bar",
        "Adv_year": 1999,
        "Color": "Yellow",
        "Runned_Miles": 123123,
        "Price": 3330
    }
    const element = createElement(body);
    expect(element).toEqual(expected);
});
