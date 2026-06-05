/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum AppScreen {
  OPENING = 'OPENING',
  LETTER = 'LETTER',
  CAKE = 'CAKE',
  FINALE = 'FINALE'
}

export interface Letter {
  id: number;
  message: string;
  shortDesc?: string;
}

export interface FloatingElement {
  id: string;
  type: 'heart' | 'petal' | 'sparkle' | 'particle';
  x: number; // percentage 0 to 100
  y: number; // percentage 0 to 120
  size: number; // in pixels
  speed: number; // scale factor
  delay: number; // seconds
  color?: string;
  rotation?: number;
}

export interface Firework {
  id: string;
  x: number; // percentage
  y: number; // percentage
  color: string;
  size: number;
}

export interface SparkleItem {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
}
