<template>
  <div class="event event--closed">
    <span class="event__icon">
      <i class="ion-close-round" />
    </span>

    <h3 class="event__actorName">
      {{data.actor.login}}
    </h3>

    <p class="event__info">
      closed <relative-time :utc="data.createdAt" />
    </p>
  </div>
</template>

<script>
export default {
  name: 'ClosedEvent',
  props: [
    'data',
  ],
};
</script>

