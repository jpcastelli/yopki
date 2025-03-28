import styles from "./page.module.css";
import ItineraryFormSearch from "@/app/components/itinerary-form-search";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
          <ItineraryFormSearch />
      </main>
    </div>
  );
}
