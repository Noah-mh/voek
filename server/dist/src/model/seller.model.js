"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleActivateAccount = exports.handleGetSellerStatus = exports.handleDeactivateAccount = exports.handleChangeEmail = exports.handleSendEmailChange = exports.handleUpdateSellerDetails = exports.handleGetSellerDetails = exports.handleGetCustomerOrders = exports.handlePackedAndShipped = exports.handleGetSellerDelivered = exports.handleGetSellerShipped = exports.handleGetSellerOrders = exports.handleResetPassword = exports.handleSendEmailForgetPassword = exports.handleForgetPassword = exports.handleLogOut = exports.handleActiveAccount = exports.handleSignUp = exports.handleSendEmailLink = exports.handleVerifyOTP = exports.updateOTP = exports.handleSendEmailOTP = exports.handleSendSMSOTP = exports.handleStoreRefreshToken = exports.handleLogin = exports.handleGetOrderDetails = exports.handleAddProduct = exports.handleGetAllCategories = exports.handleGetAllProducts = void 0;
const database_1 = __importDefault(require("../../config/database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const sendInBlue_1 = __importDefault(require("../../config/sendInBlue"));
const teleSign_1 = __importDefault(require("../../config/teleSign"));
const config_1 = __importDefault(require("../../config/config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// GET all products from 1 seller
const handleGetAllProducts = async (sellerId) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `SELECT p.product_id, p.name, p.description, p.active, pv.sku, pv.variation_1, pv.variation_2, pv.quantity, pv.price, pv.active AS availability, p.category_id, c.name AS category FROM products p
    RIGHT OUTER JOIN listed_products lp 
    ON lp.product_id = p.product_id
    LEFT JOIN product_variations pv
    ON pv.product_id = p.product_id
    INNER JOIN category c
    ON c.category_id = p.category_id
    WHERE lp.seller_id = ?
    ORDER BY p.product_id ASC;`;
    try {
        const result = await connection.query(sql, [sellerId]);
        return result[0];
    }
    catch (err) {
        console.log(err);
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleGetAllProducts = handleGetAllProducts;
// GET all categories
const handleGetAllCategories = async () => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `SELECT category_id, name FROM category
  ORDER BY name ASC;`;
    try {
        const result = await connection.query(sql);
        return result[0];
    }
    catch (err) {
        console.log(err);
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleGetAllCategories = handleGetAllCategories;
// POST insert a new product
const handleAddProduct = async (sellerId, name, description, category_id, variation_1, variation_2, quantity, price) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql1 = `INSERT INTO products (name, description, category_id)
  VALUES (?, ?, ?);`;
    const sql2 = `INSERT INTO listed_products (product_id, seller_id)
  VALUES (?, ?);`;
    const sql3 = `INSERT INTO product_variations (sku, product_id, variation_1, variation_2, quantity, price)
  VALUES (UUID(), ?, ?, ?, ?, ?)`;
    try {
        // start a local transaction
        connection.beginTransaction();
        // variation .join with , then .split with ,
        // then run sql3 thru a for loop w [variation_1[i]] for every variation_2
        let var1Arr = variation_1.split(", ");
        let var2Arr = variation_2.split(", ");
        const result1 = await Promise.resolve(connection.query(sql1, [name, description, category_id]))
            .then((response) => {
            let lastInsertId = Object.values(response[0])[2];
            const result2 = connection.query(sql2, [lastInsertId, sellerId]);
            // const result3: any = connection.query(sql3, [lastInsertId, variation_1, variation_2, quantity, price]);
            var1Arr.forEach((option1) => {
                var2Arr.forEach((option2) => {
                    let result3 = connection.query(sql3, [lastInsertId, option1, option2, quantity, price]);
                });
            });
        });
        connection.commit();
        return;
    }
    catch (err) {
        connection.rollback();
        connection.release();
        console.log(err);
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleAddProduct = handleAddProduct;
// export const handleEditProduct
// GET order details
const handleGetOrderDetails = async (ordersId) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `SELECT c.username, c.email, op.total_price, o.orders_date, s.shipment_created, s.shipment_delivered FROM orders o
    INNER JOIN customer c 
    ON o.customer_id = c.customer_id
    INNER JOIN orders_product op
    ON o.orders_id = op.orders_id
    LEFT JOIN shipment s
    ON o.shipment_id = s.shipment_id
    WHERE o.orders_id = ?;`;
    try {
        const result = await connection.query(sql, [ordersId]);
        return result[0];
    }
    catch (err) {
        console.log(err);
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleGetOrderDetails = handleGetOrderDetails;
const handleLogin = async (email, password) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `SELECT password, seller_id, phone_number, shop_name, email FROM seller WHERE email = ?`;
    try {
        const result = await connection.query(sql, [email]);
        const encryptrdPassword = result[0].length ? result[0][0].password : '';
        const check = await bcrypt_1.default.compare(password, encryptrdPassword);
        if (check) {
            const seller_id = result[0][0]?.seller_id;
            const phone_number = result[0][0]?.phone_number;
            const email = result[0][0]?.email;
            const shopName = result[0][0]?.shop_name;
            return { seller_id, phone_number, email, shopName };
        }
        return null;
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleLogin = handleLogin;
const handleStoreRefreshToken = async (refreshtoken, seller_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `UPDATE seller SET refresh_token =? WHERE seller_id =?`;
    try {
        const result = await connection.query(sql, [refreshtoken, seller_id]);
        return result[0].affectedRows;
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleStoreRefreshToken = handleStoreRefreshToken;
const handleSendSMSOTP = async (phoneNumber, seller_id) => {
    try {
        const OTP = Math.floor(100000 + Math.random() * 900000);
        const result = await (0, exports.updateOTP)(OTP, seller_id);
        const message = `Your OTP is ${OTP}`;
        const messageType = "ARN";
        teleSign_1.default.sms.message((err, res) => {
            if (err === null) {
                console.log(`Messaging response for messaging phone number: ${phoneNumber}` +
                    ` => code: ${res["status"]["code"]}` +
                    `, description: ${res["status"]["description"]}`);
            }
            else {
                console.log("Unable to send message. " + err);
                throw new Error(err);
            }
        }, `65${phoneNumber}`, message, messageType);
        return result;
    }
    catch (err) {
        throw new Error(err);
    }
};
exports.handleSendSMSOTP = handleSendSMSOTP;
const handleSendEmailOTP = async (email, seller_id) => {
    try {
        const OTP = Math.floor(100000 + Math.random() * 900000);
        const tranEmailApi = new sendInBlue_1.default.TransactionalEmailsApi();
        const sender = {
            email: 'voek.help.centre@gmail.com'
        };
        const receivers = [
            {
                email: email
            }
        ];
        const result = await (0, exports.updateOTP)(OTP, seller_id);
        tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'OTP Verification For VOEK Seller Login',
            textContent: `Your OTP is ${OTP}`
        }).then((response) => {
            console.log(response);
            return result;
        }).catch((err) => {
            throw new Error(err);
        });
    }
    catch (err) {
        throw new Error(err);
    }
};
exports.handleSendEmailOTP = handleSendEmailOTP;
const updateOTP = async (OTP, seller_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `UPDATE seller_otp SET otp = ?, otp_creation = ? WHERE seller_id = ?`;
    try {
        const result = await connection.query(sql, [OTP, convertLocalTimeToUTC(), seller_id]);
        return result[0].affectedRows;
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.updateOTP = updateOTP;
const handleVerifyOTP = async (seller_id, OTP) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = 'SELECT * FROM seller_otp WHERE otp = ? and seller_id = ? and timestampdiff(SECOND, otp_creation, utc_timestamp()) < 120';
    try {
        const result = await connection.query(sql, [OTP, seller_id]);
        return result[0];
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleVerifyOTP = handleVerifyOTP;
const handleSendEmailLink = async (signUpToken, email) => {
    try {
        const tranEmailApi = new sendInBlue_1.default.TransactionalEmailsApi();
        const sender = {
            email: "voek.help.centre@gmail.com",
        };
        const receivers = [
            {
                email: email,
            },
        ];
        tranEmailApi
            .sendTransacEmail({
            sender,
            to: receivers,
            subject: "Verification Link For VOEK Sign Up",
            textContent: `http://localhost:5173/seller/signup/verify?signupToken=${signUpToken}`,
        })
            .then((response) => {
            console.log(response);
            return;
        })
            .catch((err) => {
            throw new Error(err);
        });
    }
    catch (err) {
        throw new Error(err);
    }
};
exports.handleSendEmailLink = handleSendEmailLink;
const handleSignUp = async (shopName, password, email, phoneNumber) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `UPDATE seller SET shop_name = ?, password = ?, phone_number = ?, date_created = NULL WHERE email = ? AND active = 0`;
    try {
        const encryptedPassword = await bcrypt_1.default.hash(password, 10);
        const result = await connection.query(sql, [shopName, encryptedPassword, phoneNumber, email]);
        if (result[0].affectedRows === 0) {
            const sql2 = `INSERT INTO seller (shop_name, password, email, phone_number, date_created) VALUES (?, ?, ?, ?, NULL)`;
            const result2 = await connection.query(sql2, [shopName, encryptedPassword, email, phoneNumber]);
            return result2[0].insertId;
        }
        else {
            const sql2 = `SELECT seller_id FROM seller WHERE email =  ?`;
            const result2 = await connection.query(sql2, [email]);
            return result2[0][0].seller_id;
        }
    }
    catch (err) {
        if (err.errno === 1062) {
            return 1062;
        }
        else {
            throw new Error(err);
        }
    }
    finally {
        await connection.release();
    }
};
exports.handleSignUp = handleSignUp;
const handleActiveAccount = async (seller_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `UPDATE seller SET active = 1 WHERE seller_id = ?`;
    try {
        const result = await connection.query(sql, [seller_id]);
        const sql2 = `UPDATE seller SET date_created = utc_timestamp()`;
        const result2 = await connection.query(sql2, null);
        const sql3 = `INSERT INTO seller_otp (seller_id) VALUES (?)`;
        const result3 = await connection.query(sql3, [seller_id]);
        return result3[0].affectedRows;
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleActiveAccount = handleActiveAccount;
const handleLogOut = async (refreshToken) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `UPDATE seller SET refresh_token = '' WHERE refresh_token = ?`;
    try {
        const result = await connection.query(sql, [refreshToken]);
        return result[0].affectedRows;
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleLogOut = handleLogOut;
const handleForgetPassword = async (email) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `SELECT * FROM seller WHERE email = ? AND active = 1`;
    try {
        const result = await connection.query(sql, [email]);
        return result[0];
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleForgetPassword = handleForgetPassword;
const handleSendEmailForgetPassword = async (forgetPasswordToken, email) => {
    try {
        const tranEmailApi = new sendInBlue_1.default.TransactionalEmailsApi();
        const sender = {
            email: "voek.help.centre@gmail.com",
        };
        const receivers = [
            {
                email: email,
            },
        ];
        tranEmailApi
            .sendTransacEmail({
            sender,
            to: receivers,
            subject: "Verification Link For VOEK Sign Up",
            textContent: `http://localhost:5173/seller/forgetPassword/verify?forgetPasswordToken=${forgetPasswordToken}`,
        })
            .then((response) => {
            console.log(response);
            return;
        })
            .catch((err) => {
            throw new Error(err);
        });
    }
    catch (err) {
        throw new Error(err);
    }
};
exports.handleSendEmailForgetPassword = handleSendEmailForgetPassword;
const handleResetPassword = async (password, seller_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `UPDATE seller SET password = ? WHERE seller_id = ? AND active = 1`;
    try {
        const encryptedPassword = await bcrypt_1.default.hash(password, 10);
        const result = await connection.query(sql, [encryptedPassword, seller_id]);
        return result[0].affectedRows;
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleResetPassword = handleResetPassword;
const handleGetSellerOrders = async (seller_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `
  SELECT products.name, orders.orders_id, orders.customer_id, orders_product.quantity, orders_product.total_price, orders.orders_date, orders_product.product_id, orders_product.orders_product_id,
  product_variations.variation_1, product_variations.variation_2, customer.username, customer.email
      FROM orders_product
      JOIN orders ON orders_product.orders_id = orders.orders_id
      JOIN product_variations ON orders_product.sku = product_variations.sku
      JOIN customer ON orders.customer_id = customer.customer_id
      JOIN products ON orders_product.product_id = products.product_id
  WHERE orders_product.product_id in (
      SELECT listed_products.product_id FROM listed_products WHERE seller_id = ?
  ) AND orders_product.shipment_id IS NULL
  `;
    try {
        const result = await connection.query(sql, [seller_id]);
        return result[0];
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleGetSellerOrders = handleGetSellerOrders;
const handleGetSellerShipped = async (seller_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `
  SELECT products.name, orders.orders_id, orders.customer_id, orders_product.quantity, orders_product.total_price, shipment.shipment_created, orders_product.product_id, orders_product.orders_product_id,
  product_variations.variation_1, product_variations.variation_2, customer.username, customer.email
      FROM orders_product
      JOIN orders ON orders_product.orders_id = orders.orders_id
      JOIN product_variations ON orders_product.sku = product_variations.sku
      JOIN shipment on orders_product.shipment_id = shipment.shipment_id
      JOIN products ON orders_product.product_id = products.product_id
    JOIN customer ON orders.customer_id = customer.customer_id
  WHERE orders_product.product_id in (
      SELECT listed_products.product_id FROM listed_products WHERE seller_id = ?
  ) AND orders_product.shipment_id IS NOT NULL AND shipment.shipment_delivered IS NULL
  `;
    try {
        const result = await connection.query(sql, [seller_id]);
        return result[0];
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleGetSellerShipped = handleGetSellerShipped;
const handleGetSellerDelivered = async (seller_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `
  SELECT products.name, orders.orders_id, orders.customer_id, orders_product.quantity, orders_product.total_price, shipment.shipment_delivered, orders_product.product_id, orders_product.orders_product_id,
  product_variations.variation_1, product_variations.variation_2, customer.username, customer.email
      FROM orders_product
      JOIN orders ON orders_product.orders_id = orders.orders_id
      JOIN product_variations ON orders_product.sku = product_variations.sku
      JOIN shipment on orders_product.shipment_id = shipment.shipment_id
      JOIN products ON orders_product.product_id = products.product_id
    JOIN customer ON orders.customer_id = customer.customer_id
  WHERE orders_product.product_id in (
      SELECT listed_products.product_id FROM listed_products WHERE seller_id = ?
  ) AND orders_product.shipment_id IS NOT NULL AND shipment.shipment_delivered IS NOT NULL
  `;
    try {
        const result = await connection.query(sql, [seller_id]);
        return result[0];
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleGetSellerDelivered = handleGetSellerDelivered;
const handlePackedAndShipped = async (orders_product_id, customer_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `INSERT INTO shipment (orders_product_id, customer_id) VALUES(?, ?)`;
    try {
        orders_product_id.forEach(async (orders_product_id) => {
            const result = await connection.query(sql, [orders_product_id, customer_id]);
            const sql2 = `UPDATE orders_product SET shipment_id = ? WHERE orders_product_id = ?`;
            const result2 = await connection.query(sql2, [result[0].insertId, orders_product_id]);
        });
        return;
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handlePackedAndShipped = handlePackedAndShipped;
const handleGetCustomerOrders = async (seller_id, orders_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `SELECT
  orders.orders_id,
  customer.username,
  customer_address.postal_code,
  customer_address.block,
  customer_address.unit_no,
  customer_address.street_name,
  customer.email,
  customer.phone_number,
  orders.orders_date,
  product_variations.sku,
  product_variations.variation_1,
  product_variations.variation_2,
  products.name,
  products.description,
  orders_product.product_id,
  orders.customer_id,
  orders_product.orders_product_id,
  orders_product.total_price,
  orders_product.quantity,
  orders_product.shipment_id,
  shipment.shipment_created,
  shipment.shipment_delivered
FROM
  orders
  JOIN orders_product ON orders.orders_id = orders_product.orders_id
  JOIN customer ON orders.customer_id = customer.customer_id
  JOIN customer_address ON orders.address_id = customer_address.address_id
  JOIN product_variations ON orders_product.sku = product_variations.sku
  JOIN products ON product_variations.product_id = products.product_id
  LEFT JOIN shipment ON orders_product.shipment_id = shipment.shipment_id
WHERE
  orders.orders_id = ?
  AND orders_product.product_id IN (
    SELECT listed_products.product_id
    FROM listed_products
    WHERE seller_id = ?
  )`;
    try {
        const result = await connection.query(sql, [orders_id, seller_id]);
        return result[0];
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleGetCustomerOrders = handleGetCustomerOrders;
const handleGetSellerDetails = async (seller_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = `SELECT email, phone_number, image_url, shop_name FROM seller WHERE seller_id = ?`;
    try {
        const result = await connection.query(sql, [seller_id]);
        return result[0];
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleGetSellerDetails = handleGetSellerDetails;
const handleUpdateSellerDetails = async (password, email, shop_name, phone_number, seller_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    try {
        let sql = `SELECT * FROM seller WHERE email like ? and seller_id != ?`;
        let result = await connection.query(sql, [email, seller_id]);
        if (result[0].length != 0) {
            return { duplicateEmail: true };
        }
        else {
            let sql = `SELECT * FROM seller WHERE email like ? and seller_id = ?`;
            let result = await connection.query(sql, [email, seller_id]);
            if (result[0].length === 0) {
                sql = 'UPDATE update_seller SET new_email = ?, email_sent = utc_timestamp() WHERE seller_id = ?';
                result = await connection.query(sql, [email, seller_id]);
                if (result[0].affectedRows === 0) {
                    sql = 'INSERT INTO update_seller (seller_id, new_email, email_sent) VALUES (?, ?, utc_timestamp())';
                    result = await connection.query(sql, [seller_id, email]);
                }
                await (0, exports.handleSendEmailChange)(seller_id, email);
                if (password) {
                    const encryptedPassword = await bcrypt_1.default.hash(password, 10);
                    sql = `UPDATE seller SET password = ?, shop_name = ?, phone_number = ? WHERE seller_id = ?`;
                    result = await connection.query(sql, [encryptedPassword, shop_name, phone_number, seller_id]);
                }
                else {
                    sql = 'UPDATE seller SET shop_name = ?, phone_number = ? WHERE seller_id = ?';
                    result = await connection.query(sql, [shop_name, phone_number, seller_id]);
                }
                return { emailChange: true };
            }
            else {
                if (password) {
                    const encryptedPassword = await bcrypt_1.default.hash(password, 10);
                    sql = `UPDATE seller SET password = ?, shop_name = ?, phone_number = ? WHERE seller_id = ?`;
                    result = await connection.query(sql, [encryptedPassword, shop_name, phone_number, seller_id]);
                }
                else {
                    sql = 'UPDATE seller SET shop_name = ?, phone_number = ? WHERE seller_id = ?';
                    result = await connection.query(sql, [shop_name, phone_number, seller_id]);
                }
            }
        }
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleUpdateSellerDetails = handleUpdateSellerDetails;
const handleSendEmailChange = async (seller_id, email) => {
    const changeSellerEmailToken = jsonwebtoken_1.default.sign({
        seller_id: seller_id,
    }, config_1.default.emailTokenSecret, { expiresIn: '300s' });
    const tranEmailApi = new sendInBlue_1.default.TransactionalEmailsApi();
    const sender = {
        email: "voek.help.centre@gmail.com",
    };
    const receivers = [
        {
            email: email,
        },
    ];
    tranEmailApi
        .sendTransacEmail({
        sender,
        to: receivers,
        subject: "Verification Link For VOEK Email Change",
        textContent: `http://localhost:5173/seller/email-verification?token=${changeSellerEmailToken}`,
    })
        .then((response) => {
        console.log(response);
        return;
    })
        .catch((err) => {
        throw new Error(err);
    });
};
exports.handleSendEmailChange = handleSendEmailChange;
const handleChangeEmail = async (seller_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    try {
        let sql = `SELECT new_email FROM update_seller WHERE seller_id = ?`;
        let result = await connection.query(sql, [seller_id]);
        const email = result[0][0].new_email;
        sql = `UPDATE seller SET email = ? WHERE seller_id = ?`;
        result = await connection.query(sql, [email, seller_id]);
        sql = `DELETE FROM update_seller WHERE seller_id = ?`;
        result = await connection.query(sql, [seller_id]);
        return;
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleChangeEmail = handleChangeEmail;
const handleDeactivateAccount = async (seller_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = 'UPDATE seller SET active = 0 WHERE seller_id = ?';
    try {
        const result = await connection.query(sql, [seller_id]);
        return;
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleDeactivateAccount = handleDeactivateAccount;
const handleGetSellerStatus = async (seller_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = 'SELECT active FROM seller WHERE seller_id = ?';
    try {
        const result = await connection.query(sql, [seller_id]);
        return result[0][0].active;
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleGetSellerStatus = handleGetSellerStatus;
const handleActivateAccount = async (seller_id) => {
    const promisePool = database_1.default.promise();
    const connection = await promisePool.getConnection();
    const sql = 'UPDATE seller SET active = 1 WHERE seller_id = ?';
    try {
        const result = await connection.query(sql, [seller_id]);
        return;
    }
    catch (err) {
        throw new Error(err);
    }
    finally {
        await connection.release();
    }
};
exports.handleActivateAccount = handleActivateAccount;
const convertLocalTimeToUTC = () => {
    const now = new Date();
    const utcYear = now.getUTCFullYear();
    const utcMonth = padZero(now.getUTCMonth() + 1);
    const utcDay = padZero(now.getUTCDate());
    const utcHours = padZero(now.getUTCHours());
    const utcMinutes = padZero(now.getUTCMinutes());
    const utcSeconds = padZero(now.getUTCSeconds());
    return `${utcYear}-${utcMonth}-${utcDay} ${utcHours}:${utcMinutes}:${utcSeconds}`;
};
const padZero = (value) => {
    return value.toString().padStart(2, '0');
};
//# sourceMappingURL=seller.model.js.map