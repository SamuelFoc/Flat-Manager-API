class Portal {
  constructor(ChildModel, database) {
    this.ChildModel = ChildModel;
    this.database = database;
  }

  getAll(req, res) {
    this.database
      .sync()
      .then(() => {
        return this.ChildModel.findAll();
      })
      .then((data) => {
        return res.status(200).json({
          count: data.length,
          message: `All data found.`,
          data: data,
        });
      })
      .catch((err) => {
        return res.status(500).json({ ERROR: err.message });
      });
  }

  getOne(req, res) {
    this.database
      .sync()
      .then(() => {
        return this.ChildModel.findAll({ where: { id: req.params.id } });
      })
      .then((data) => {
        return res.status(200).json({
          count: data.length,
          message: `Data found.`,
          data: data,
        });
      })
      .catch((err) => {
        return res.status(500).json({ ERROR: err.message });
      });
  }

  createOne(req, res, ObjectModel) {
    this.database
      .sync()
      .then(() => {
        console.log(ObjectModel);
        return this.ChildModel.create(ObjectModel);
      })
      .then((data) => {
        return res.status(200).json({
          count: 1,
          message: `Data has been recorded.`,
          data: data,
        });
      })
      .catch((err) => {
        return res.status(500).json({ ERROR: err.message });
      });
  }

  deleteOne(req, res) {
    this.database
      .sync()
      .then(() => {
        return this.ChildModel.destroy({ where: { id: req.params.id } });
      })
      .then((data) => {
        return res.status(200).json({
          count: 1,
          message: `Data removed.`,
          data: data,
        });
      })
      .catch((err) => {
        return res.status(500).json({ ERROR: err.message });
      });
  }

  updateOne(req, res, ObjectModel) {
    this.database
      .sync()
      .then((data) => {
        return this.ChildModel.update(ObjectModel, {
          where: {
            name: req.params.name,
          },
        });
      })
      .then((event) => {
        return res.status(200).json({
          count: 1,
          message: `data updated.`,
          data: event,
        });
      })
      .catch((err) => {
        return res.status(500).json({ ERROR: err.message });
      });
  }
}

module.exports = Portal;
