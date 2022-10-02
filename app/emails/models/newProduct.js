const newProduct = (product_info) => {
  return `<div>
    <h3><span style="color: green;">✔️</span> Somebody needs ${product_info.name} 🙏</h3>
    <div
      style="
            background-color: black;
            width: 200px;
            color: aliceblue;
            padding: 10px 15px;
            border-radius: 8px;
            margin-left: 2.5rem;
        "
    >
      <div>
        <strong>Estimated price:&ensp;</strong>
        <span>
          ${product_info.price}
          <strong>CZK</strong>
        </span>
      </div>
      <div>
        <strong>Priority:&ensp;</strong>
        <span>${product_info.urgent}</span>
      </div>
    </div>
  </div>`;
};

module.exports = newProduct;
