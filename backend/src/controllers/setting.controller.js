import prisma from '../config/db.js';

export const getSettings = async (req, res, next) => {
  try {
    const settings = await prisma.setting.findMany();
    const config = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    
    // Default values if not in DB
    if (!config.maintenanceMode) {
      config.maintenanceMode = false;
    }

    res.json(config);
  } catch (error) {
    next(error);
  }
};

export const updateSetting = async (req, res, next) => {
  try {
    const { key, value } = req.body;
    
    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: {
        id: `setting_${Date.now()}`,
        key,
        value,
      },
    });

    res.json({ message: 'Setting updated successfully', setting });
  } catch (error) {
    next(error);
  }
};
