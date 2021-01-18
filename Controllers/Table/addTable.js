const _ = require("lodash");
const joi = require("joi");

const { Table } = require("../../Models/Table");

exports.addTable = async function(req, res, next) {
  if(req.body.number < 1) return res.status(400).json({statusCode: 400, message: 'رقم الطرابيزة لا يمكن ان يكون اقل من 1'})

  const { error } = addTable(req.body);
  if (error)
    return res
      .status(400)
      .json({ statusCode: 400, message: error.details[0].message });

  let table = await Table.findOne({ number: req.body.number });
  if (table)
    return res
      .status(400)
      .json({ statusCode: 400, message: "رقم الطرابيزة موجود بالفعل" });

  table = new Table(_.pick(req.body, "number"));

  await table.save();

  res.status(200).json({ statusCode: 200, result: table });
};

function addTable(table) {
  const schema = joi.object({
    number: joi.number().required().min(1)
  });
  return schema.validate(table);
}
