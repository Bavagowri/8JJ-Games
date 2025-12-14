import { useEffect, useState } from "react";
import GameSection from "../../components/GameSection/GameSection";


export default function SelfHosted({ games }) {
  const list = games.filter(g => g.source === "self");

  return (
    <GameSection
      title="🟢 Self Hosted Games"
      games={list}
    />
  );
}
