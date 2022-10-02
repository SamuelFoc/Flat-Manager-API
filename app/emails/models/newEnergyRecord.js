const newRecord = (record_info) => {
  return `<div>
      <h3><span style="color: green;">✔️</span> New energy records added ✍🏼</h3>
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
          <strong>Measured value:&ensp;</strong>
          <span>
            ${record_info.measured_value}
            <strong>CZK</strong>
          </span>
        </div>
        <div>
          <strong>Type:&ensp;</strong>
          <span>${record_info.type}</span>
        </div>
      </div>
    </div>`;
};

module.exports = newProduct;
