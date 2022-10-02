const newFeature = (feature_info) => {
  return `<div>
      <h3><span style="color: green;">✔️</span> There is a new feature in Flat Manager 💡</h3>
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
          <strong>About feature:&ensp;</strong>
          <span>
            ${feature_info.info}
            <strong>CZK</strong>
          </span>
        </div>
      </div>
    </div>`;
};

module.exports = newFeature;
