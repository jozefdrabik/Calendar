import { reactive, onMounted } from "vue";

export const useCalendarSettings = () => {
  const settings = reactive({
    maxNights: null as number | null,
    minDate: "",
    language: {
      name: "",
      id: 1,
      code: "",
    },
    defaultRange: "",
    favoriteDates: "",
  });

  const apiURL = import.meta.env.VITE_API_URL;

  const fetchSettings = async () => {
    try {
      const response = await fetch(apiURL);
      if (!response.ok) throw new Error("Failed to fetch settings");
      const data = await response.json();

      Object.assign(settings, {
        maxNights: data[0].maxNights,
        minDate: data[0].minDate,
        language: data[0].language,
        defaultRange: data[0].defaultRange,
        favoriteDates: data[0].favoriteDates,
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
      alert("Failed to load settings!");
    }
  };

  const saveSettings = async () => {
    try {
      const response = await fetch(`${apiURL}/1`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error("Failed to save settings");

      alert("Settings have been saved!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings!");
    }
  };

  onMounted(() => {
    fetchSettings();
  });

  return { settings, fetchSettings, saveSettings };
};
