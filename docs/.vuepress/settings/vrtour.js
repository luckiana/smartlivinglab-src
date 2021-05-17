const config = {
  floor: {
    name: "Floor",
    texture: "/asset/vrtour/floor.jpg",
    paths: {
      kitchen: {
        lat: -5, // 90 ~ -90
        lon: 90 - 10, // 0 ~ 360
        radius: 1.5, // 1 ~ 5
      },
      patient_bed: {
        lat: -5,
        lon: 180,
        radius: 1.5,
      },
      smart_garden: {
        lat: -10,
        lon: 90 + 44,
        radius: 2,
      },
    },
  },
  kitchen: {
    name: "Kitchen",
    texture: "/asset/vrtour/kitchen.jpg",
    paths: {
      smart_garden: {
        lat: 0,
        lon: 90 + 17,
        radius: 1.5,
      },
      floor: {
        lat: 2,
        lon: 180,
        radius: 1.5,
      },
      alexa: {
        lat: -2,
        lon: 20,
        radius: 1,
        clickable: false,
        text: "Alexa",
      },
    },
  },
  living_room: {
    name: "Living Room",
    texture: "/asset/vrtour/living-room.jpg",
    paths: {
      smart_garden: {
        lat: 0,
        lon: -15,
        radius: 1.5,
      },
    },
  },
  patient_bed: {
    name: "Patient Bed",
    texture: "/asset/vrtour/patient-bed.jpg",
    paths: {
      living_room: {
        lat: 2,
        lon: -85,
        radius: 2.2,
      },
    },
  },
  smart_garden: {
    name: "Smart Garden",
    texture: "/asset/vrtour/smart-garden.jpg",
    paths: {
      floor: {
        lat: -1,
        lon: -180 + 30,
        radius: 2.3,
      },
      kitchen: {
        lat: 0,
        lon: -90 - 15,
        radius: 2,
      },
      living_room: {
        lat: -2,
        lon: 90 + 30,
        radius: 1.6,
      },
    },
  },
};

config.default = config.floor;

module.exports = config;
