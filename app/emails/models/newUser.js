const newUser = (user_info) => {
  return `<div>
      <h3><span style="color: green;">✔️</span> Welcome ${user_info.user} 🙋🏻‍♂️</h3>
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
          <strong>Contect:&ensp;</strong>
          <span>
            ${user_info.contact}
            <strong>CZK</strong>
          </span>
        </div>
        <div>
          <strong>Work:&ensp;</strong>
          <span>${user_info.work}</span>
        </div>
      </div>
    </div>`;
};

module.exports = newUser;
