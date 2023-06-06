const { prisma } = require("../prisma/prisma-client");

/**
 * @route GET /api/employees
 * @desс getging all employees
 * @access Private
 */
const all = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany();

    res.status(200).json(employees);
  } catch {
    res.status(500).json({ message: "Не удалось получить сотрудников" });
  }
};

/**
 * @route POST /api/employees/add
 * @desс adding employee
 * @access Private
 */
const add = async (req, res) => {
  try {
    const data = req.body;

    if (!data.firstName || !data.lastName || !data.address || !data.age) {
      return res.status(400).json({ message: "Все поля обязательные" });
    }

    const employee = await prisma.employee.create({
      data: {
        ...data,
        userId: req.user.id,
      },
    });

    res.status(201).json(employee);
  } catch {
    res.status(500).json({ message: "Что-то пошло не так" });
  }
};

/**
 * @route POST /api/employees/remove/:id
 * @desс remove employee
 * @access Private
 */
const remove = async (req, res) => {
  try {
    const { id } = req.body;

    await prisma.employee.delete({
      where: {
        id,
      },
    });

    res.status(204).json("OK");
  } catch {
    res.status(500).json({ message: "Не удалось удалить сотрудника" });
  }
};

/**
 * @route PUT /api/employees/edit/:id
 * @desс edit info employee
 * @access Private
 */
const edit = async (req, res) => {
  try {
    const data = req.body;
    const id = data.id;

    await prisma.employee.update({
      where: {
        id,
      },
      data,
    });

    res.status(204).json("OK");
  } catch {
    res.status(500).json({ message: "Не удалось редактировать информацию о сотруднике" });
  }
};

/**
 * @route GET /api/employees/:id
 * @desс get employee
 * @access Private
 */
const employee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await prisma.employee.findUnique({
      where: {
        id,
      },
    });

    res.status(200).json(employee);
  } catch {
    res.status(500).json({ message: "Не удалось получить сотрудника" });
  }
};

module.exports = {
  all,
  add,
  remove,
  edit,
  employee,
};
