<?php

/**
 * Modified from the original x_frame_options_configuration module.
 */

namespace Drupal\jigs\EventSubscriber;

use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Subscribing an event.
 */
class XframeSubscriber implements EventSubscriberInterface {
  /**
   * Executes actions on the respose event.
   *
   * @param \Symfony\Component\HttpKernel\Event\ResponseEvent $event
   *   Filter Response Event object.
   */
  public function onKernelResponse(ResponseEvent $event) {
    $response = $event->getResponse();
    $response->headers->remove('X-Frame-Options');
  }

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    // Adds the event in the list of KernelEvents::RESPONSE with priority -20.
    $events[KernelEvents::RESPONSE][] = ['onKernelResponse', -20];
    return $events;
  }

}
