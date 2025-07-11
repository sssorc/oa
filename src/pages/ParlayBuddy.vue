<script setup>
import { usePageTitle } from '@/composables/usePageTitle';
import KnowledgeArticle from '@/components/knowledge/KnowledgeArticle.vue';
import KnowledgeHeader from '@/components/knowledge/KnowledgeHeader.vue';

// Set page title
usePageTitle('CNO Parlay Buddy Extension', 'Calculate EV and Free Bet conversions for parlays on the Crazy Ninja Odds +EV page');
</script>

<template>
    <KnowledgeArticle :back-button="false">
        <KnowledgeHeader>CNO Parlay Buddy Extension</KnowledgeHeader>
        <img src="@/assets/images/parlay-buddy.webp" width="200px" class="float-right ml-4 max-sm:hidden" alt="Screenshot of Parlay Buddy extension" />
        <p>
            Parlay Buddy is a chrome extension for the <a href="https://crazyninjaodds.com/site/tools/positive-ev.aspx" target="_blank">+EV page</a> on Crazy Ninja Odds. It adds a movable box to the
            page which allows you to quickly devig a parlay with legs of your choice. You can use this for example to find the EV of a boosted parlay or find a good conversion for a bonus bet.
        </p>
        <p>Clicking any table row will toggle it as selected and Parlay Buddy will automatically devig your parlay once 2+ legs are selected.</p>
        <p>Find it here on the <a href="https://chromewebstore.google.com/detail/cno-parlay-buddy/hcpaaidgaenjoobhlbacpfnolcebefef" target="_blank">chrome web store</a>!</p>
        <img src="@/assets/images/parlay-buddy.webp" width="200px" class="sm:hidden" alt="Screenshot of Parlay Buddy extension" />
        <p class="text-sm">Note: it will not run for same game parlays, as each sportsbook has its own engine for calculating odds on SGPs.</p>
    </KnowledgeArticle>
</template>
