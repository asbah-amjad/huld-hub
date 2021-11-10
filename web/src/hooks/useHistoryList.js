import { useMemo } from "react";

const HISTORY_TYPE = {
  education: "Education",
  work: "Work",
};

const capitalize = (string) =>
  string.trim().replace(/^\w/, (c) => c.toUpperCase());

/**
 * A function that produces the props for using HistoryList component
 *
 * @param {Array<object>} historyItems - Array of history items
 * @param {*} type - type of history items
 * @returns {object}
 */
const getHistoryProps = (historyItems = [], type) => {
  return {
    title: `${capitalize(type)} History`,
    noItemDescription: `No ${capitalize(type)} History Provided`,
    historyItems: historyItems.map((historyItem) => ({
      id: historyItem.id,
      organisation:
        historyItem[type === HISTORY_TYPE.education ? "school" : "company"],
      title:
        historyItem[type === HISTORY_TYPE.education ? "degree" : "position"],
      description: historyItem.description,
      start_date: historyItem.start_date,
      end_date: historyItem.end_date,
    })),
  };
};

const useHistoryList = (profile, type) => {
  const historyList = useMemo(
    () =>
      getHistoryProps(
        profile
          ? profile[
              type.toUpperCase() === HISTORY_TYPE.education
                ? "education_histories"
                : "work_experiences"
            ]
          : [],
        type.toUpperCase()
      ),
    [profile, type]
  );

  return historyList;
};

export default useHistoryList;
