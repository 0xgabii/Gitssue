<template>
  <div class="event event--reopened">
    <span class="event__icon">
      <i class="ion-checkmark-round" />
    </span>

    <h3 class="event__actorName">
      {{data.actor.login}}
    </h3>

    <p class="event__info">
      reopened <relative-time :utc="data.createdAt" />
    </p>
  </div>
</template>

<script>
export default {
  name: 'ReopenedEvent',
  props: [
    'data',
  ],
};
</script>

