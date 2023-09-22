import { fork } from 'child_process';
import * as schedule from "node-schedule"

// Start express server
const express = fork('express');

// Run scraper straight away
fork('scrape_instagram_profiles');

const scraper = schedule.scheduleJob('0 20 * * *', () => {
    fork('scrape_instagram_profiles')
})

const triggerBuild = schedule.scheduleJob('0 21 * * *', () => {
    fork('trigger-build')
})