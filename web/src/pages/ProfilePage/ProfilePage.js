import React, { useContext, useEffect, useMemo, useState } from "react";
import { useHistory, useRouteMatch } from "react-router";
import Cookies from "js-cookie";

import useProfile from "../../hooks/useProfile";
import useCompetences from "../../hooks/useCompetences";
import useCompetenceCategories from "../../hooks/useCompetenceCategories";

import ProfilePageEdit from "./ProfilePageEdit";
import ProfilePageView from "./ProfilePageView";

import { UserContext } from "../../App";
import { getCompetencesWithCategoryNames } from "../../utils";

const HISTORY_TYPE = {
  education: "Education",
  work: "Work",
};

/**
 * A function that produces the props for using HistoryList component
 *
 * @param {Array<object>} historyItems - Array of history items
 * @param {*} type - type of history items
 * @returns {object}
 */
const getHistoryProps = (historyItems = [], type) => {
  return {
    title: `${type} History`,
    noItemDescription: `No ${type} History Provided`,
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

function ProfilePage({ id, onSave }) {
  let history = useHistory();
  let match = useRouteMatch();

  const { jwt } = useContext(UserContext);

  const [profile, setProfile] = useProfile(id || match.params.id, jwt);

  const allLanguages = useCompetences("coding languages", jwt);
  const allKeywords = useCompetences("keywords", jwt);
  const competenceCategories = useCompetenceCategories(jwt);

  const [edit, setEdit] = useState(false);
  const onSaveClick = async (_profile) => {
    setProfile(_profile);
    await onSave(_profile, jwt);
    setEdit(false);
  }

  useEffect(() => {
    let jwt = Cookies.get("hub-jwt");
    if (!jwt) {
      history.push("/");
    }
  }, [history]);

  const educationHistory = useMemo(
    () =>
      getHistoryProps(
        profile ? profile.education_histories : [],
        HISTORY_TYPE.education
      ),
    [profile]
  );

  const workHistory = useMemo(
    () =>
      getHistoryProps(
        profile ? profile.work_experiences : [],
        HISTORY_TYPE.work
      ),
    [profile]
  );

  const { languages, keywords } = useMemo(() => {
    if (profile && profile.competences) {
      const competences = getCompetencesWithCategoryNames(competenceCategories, profile.competences);
      return {
        languages: competences.filter(competence => competence.category_name === "coding languages"),
        keywords: competences.filter(competence => competence.category_name === "keywords"),
      }
    }
    return { languages: [], keywords: [] };
  }, [competenceCategories, profile]);

  if (profile === false) {
    // TODO: render actual 404 page
    return <h1>404</h1>;
  }

  const profileProps = { ...profile, educationHistory, workHistory, languages, keywords };
  if (edit) {
    return (
      <ProfilePageEdit
        profile={profileProps} 
        onSaveClick={onSaveClick} 
        onCancelClick={() => setEdit(false)} 
        allLanguages={allLanguages}
        allKeywords={allKeywords}
      />
    );
  } else {
    return (
      <ProfilePageView profile={profileProps} onEditClick={() => setEdit(true)} />
    );
  }
}

export default ProfilePage;
